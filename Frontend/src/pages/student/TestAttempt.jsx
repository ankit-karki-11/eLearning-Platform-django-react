import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  useGetAttemptDetailsQuery,
  useSubmitAttemptMutation,
} from '@/features/api/smarttestApi';

export default function TestAttempt() {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const { data: attempt, isLoading, isError, refetch } = useGetAttemptDetailsQuery(id);
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Use time_remaining from attempt data
  const [timeLeft, setTimeLeft] = useState(0);

  // Handle user trying to leave the page
  useEffect(() => {
    if (submitted || !attempt) return;

    const handleBeforeUnload = async (e) => {
      if (!submitted && !isLeaving) {
        e.preventDefault();
        setIsLeaving(true);
        
        // Auto-submit the test
        try {
          const resultsPayload = attempt.selected_questions.map(q => ({
            question: q.id,
            selected_option: answers[q.id] || null,
          }));

          await submitAttempt({ attemptId: id, results: resultsPayload }).unwrap();
          toast.warning("Test auto-submitted as you left the page");
        } catch (error) {
          console.error("Error auto-submitting test:", error);
        }
        
        // Allow navigation after submission
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.location.reload(); // Refresh to show results
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [submitted, isLeaving, attempt, answers, id, submitAttempt]);

  // Prevent copying text from the test
  useEffect(() => {
    const handleCopy = (e) => {
      if (!submitted) {
        toast.error("Copying test content is not allowed");
        e.preventDefault();
      }
    };

    const handleContextMenu = (e) => {
      if (!submitted) {
        toast.error("Right-click is disabled during the test");
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);

    // Select and disable text selection
    document.body.style.userSelect = submitted ? 'auto' : 'none';
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.body.style.userSelect = 'auto';
    };
  }, [submitted]);

  // initialize answers + submitted/passed status + timer
  useEffect(() => {
    if (attempt) {
      // Initialize answers
      if (attempt.results && attempt.results.length > 0) {
        const initialAnswers = {};
        attempt.results.forEach(r => {
          initialAnswers[r.question] = r.selected_option;
        });
        setAnswers(initialAnswers);
      }

      // Initialize status
      const isSubmitted = attempt.status === 'submitted';
      setSubmitted(isSubmitted);

      const didPass = attempt.total_score >= 6;
      setPassed(didPass);

      // Initialize timer with server time_remaining (convert minutes to seconds)
      if (attempt.time_remaining && !isSubmitted) {
        setTimeLeft(Math.floor(attempt.time_remaining * 60));
      } else if (isSubmitted) {
        setTimeLeft(0);
      }
    }
  }, [attempt]);

  // countdown effect
  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (!submitted && timeLeft === 0) {
      handleSubmit(true); // auto submit when time ends
    }
  }, [timeLeft, submitted]);

  const handleOptionSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async (auto = false) => {
    if (!attempt) return;
    
    // For auto-submit, we allow unanswered questions
    if (!auto) {
      const unanswered = attempt.selected_questions.filter(q => !answers[q.id]);
      if (unanswered.length > 0) {
        if (!window.confirm("You have unanswered questions. Are you sure you want to submit?")) {
          return;
        }
      }
    }

    try {
      const resultsPayload = attempt.selected_questions.map(q => ({
        question: q.id,
        selected_option: answers[q.id] || null, // null if unanswered
      }));

      const res = await submitAttempt({ attemptId: id, results: resultsPayload }).unwrap();

      setSubmitted(true);
      const didPass = res.test_attempt.total_score >= 6;
      setPassed(didPass);

      if (auto) {
        toast.warning("Time is up! Test auto-submitted.");
      } else {
        toast.success("Test submitted successfully!");
      }

      refetch();
    } catch (error) {
      toast.error("Error submitting test. Please try again.");
    }
  };

  const handleCertificate = () => {
    navigate(`/certificate/${slug}/`);
  };

  const handleRetake = () => {
    navigate(`/course/${slug}/progress`);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center">Loading test...</p>
    </div>
  );
  
  if (isError || !attempt) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-red-500">Test not found.</p>
    </div>
  );

  // format timer (mm:ss)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 mt-12">
      {/* Sticky Header with Timer and Submit Button */}
      {!submitted && (
        <div className="bg-white border-b shadow-sm sticky top-0 z-50 py-3 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{attempt.title}</h1>
          <div className="flex items-center space-x-4">
            <div className={`text-lg font-medium ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
              Time: {formatTime(timeLeft)}
            </div>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-blue-950 text-white px-6"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        {!submitted && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-gray-700">
              Answer all questions before submitting. If you leave this page, your test will be automatically submitted.
            </p>
          </div>
        )}

        {submitted && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4 text-center">Test Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Your Score</p>
                <p className="text-2xl font-bold">{attempt.total_score}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-2xl font-bold">{attempt.selected_questions.reduce((acc, q) => acc + q.marks, 0)}</p>
              </div>
            </div>
            
            <p className={`text-center text-lg font-semibold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? 'Congratulations! You passed the test.' : 'Sorry, you did not pass the test.'}
            </p>
            
            {/* {attempt.feedback && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-gray-700"><span className="font-medium">Feedback:</span> {attempt.feedback}</p>
              </div>
            )} */}

            <div className="flex justify-center space-x-4 mt-6">
              {passed ? (
                <Button
                  onClick={handleCertificate}
                  className="bg-blue-800 hover:bg-blue-900 text-white"
                >
                  Get Certificate
                </Button>
              ) : (
                <Button
                  onClick={handleRetake}
                  className="bg-gray-900 hover:bg-gray-950 text-white cursor-pointer"
                >
                  Review Course & Retake
                </Button>
              )}
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Return to Home
              </Button>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {attempt.selected_questions.map((question, qIndex) => (
            <div key={question.id} className="p-6 bg-white rounded-lg shadow-sm border">
              <p className="mb-4 font-medium select-none">{qIndex + 1}. {question.question_text}</p>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[question.id] === option.id;
                  const result = attempt.results && attempt.results.find(r => r.question === question.id);
                  let className = 'p-3 rounded cursor-pointer transition-colors border select-none ';
                  
                  if (!submitted) {
                    className += isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300';
                  } else if (result) {
                    if (option.id === result.selected_option) {
                      className += result.scored_marks > 0 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50';
                    } else if (option.is_correct) {
                      className += 'border-green-500 bg-green-50';
                    } else {
                      className += 'border-gray-200';
                    }
                  }

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleOptionSelect(question.id, option.id)}
                      className={className}
                    >
                      <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span> 
                      {option.option_text}
                    </div>
                  );
                })}
              </div>
              
              {submitted && attempt.results && attempt.results.find(r => r.question === question.id) && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Your answer:</span> {
                      question.options.find(o => o.id === answers[question.id])?.option_text || "Not answered"
                    }
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit button at bottom for mobile */}
        {!submitted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg md:hidden">
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}