import { useParams } from 'react-router-dom';
import { 
  useGetTestDetailsQuery, 
  useSubmitAnswerMutation,
  useSubmitAttemptMutation, 
  useGetAttemptQuery 
} from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const TestAttemptPage = () => {
  const { testId, attemptId } = useParams();
  const navigate = useNavigate();
  
  // API hooks
  const { data: test, isLoading, error } = useGetTestDetailsQuery(testId);
  const { data: attempt } = useGetAttemptQuery(attemptId);
  const [submitAnswer, { isLoading: isSubmittingAnswer }] = useSubmitAnswerMutation();
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();
  
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const isSubmitted = attempt?.status === 'submitted';

  // Reset to first question when test loads
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [test]);

  // Handle answer input
  const handleAnswerChange = (questionId, response) => {
    setAnswers((prev) => ({ ...prev, [questionId]: response }));
  };

  // Submit individual answer and move to next question
  const handleSubmitAnswer = async (questionId) => {
    if (!answers[questionId]?.trim()) {
      toast.warning('Please write an answer before submitting');
      return;
    }

    try {
      await submitAnswer({
        attemptId,
        questionId,
        response: answers[questionId] || '',
      }).unwrap();
      
      toast.success('Answer submitted');
      
      // Move to next question or show completion
      if (currentQuestionIndex < (test?.questions.length ?? 0) - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowCompletion(true);
      }
    } catch (err) {
      toast.error('Failed to submit answer');
      console.error('Submit answer error:', err);
    }
  };

  const handleSubmitTest = async () => {
    try {
      await submitAttempt({ testId, attemptId }).unwrap();
      navigate(`/test-attempts/${attemptId}/results`);
    } catch (err) {
      console.error('Failed to submit test:', err);
      toast.error('Failed to submit test');
    }
  };

  // Calculate progress
  const progress = test ? Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100) : 0;

  // Loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading test...</p>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-start text-red-600">
            <svg className="h-5 w-5 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">
                {error.status === 403 ? 'Access Denied' : 'Loading Error'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {error.status === 403 
                  ? "You don't have permission to access this test."
                  : "Failed to load test. Please try again later."}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4 w-full"
            variant="outline"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Already submitted state
  if (isSubmitted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Test Submitted Successfully</h3>
          <div className="mt-2 text-gray-500">
            <p>Submitted on: {new Date(attempt.completed_at).toLocaleString()}</p>
            <p className="mt-2">You scored: {attempt.score} out of {attempt.total_marks}</p>
          </div>
          <div className="mt-6 grid gap-3">
            <Button
              onClick={() => navigate(`/test-attempts/${attemptId}/results`)}
              className="w-full"
            >
              View Detailed Results
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Completion state (all questions answered)
  if (showCompletion && test) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">All Questions Answered!</h3>
          <p className="mt-2 text-gray-500">You've completed all {test.questions.length} questions.</p>
          
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleSubmitTest}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalizing Submission...
                </span>
              ) : 'Submit Your Test'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setShowCompletion(false);
              }}
              className="w-full"
            >
              Review Answers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal question view
  if (test && currentQuestionIndex < test.questions.length) {
    const question = test.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-12">
        {/* Test Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  test.level === 'basic' ? 'bg-green-100 text-green-800' :
                  test.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                </span>
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  {test.time_limit} min time limit
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {question.question_text}
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
              {question.marks} mark{question.marks !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="mt-4 space-y-4">
            <textarea
              className="w-full p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={6}
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={isSubmittingAnswer}
            />
            
            <div className="flex justify-between items-center">
              {currentQuestionIndex > 0 && (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  variant="outline"
                  className="mr-auto"
                >
                  Previous Question
                </Button>
              )}
              
              <Button
                onClick={() => handleSubmitAnswer(question.id)}
                disabled={isSubmittingAnswer || !answers[question.id]?.trim()}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmittingAnswer ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : isLastQuestion ? 'Submit Final Answer' : 'Submit & Next Question'}
              </Button>
            </div>
          </div>
        </div>

        {/* Test info footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You can return to previous questions before submitting the test</p>
        </div>
      </div>
    );
  }

  return null;
};

export default TestAttemptPage;