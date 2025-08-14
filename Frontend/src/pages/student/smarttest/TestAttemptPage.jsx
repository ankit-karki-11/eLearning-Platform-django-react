import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAttemptDetailsQuery,
  useSubmitAnswerMutation,
  useSubmitAttemptMutation,
} from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TestAttemptPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const { data: attempt, isLoading, isError } = useGetAttemptDetailsQuery(attemptId);
  const [submitAnswer] = useSubmitAnswerMutation();
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (attempt && attempt.results) {
      const initialAnswers = {};
      attempt.results.forEach((result) => {
        initialAnswers[result.question] = result.selected_option;
      });
      setAnswers(initialAnswers);
    }
  }, [attempt]);

  if (isLoading) return <p className="text-center py-8 text-white">Loading test...</p>;
  if (isError) return <p className="text-center py-8 text-red-400">Error loading test data.</p>;

  const handleOptionSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    const unanswered = attempt.selected_questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      const resultsPayload = attempt.selected_questions.map(q => ({
        question: q.id,
        selected_option: answers[q.id]
      }));

      await submitAttempt({
        attemptId,
        results: resultsPayload
      }).unwrap();

      setSubmitted(true);
      toast.success("Test submitted successfully!");
      navigate(`/test-results/${attemptId}`, {
        state: {
          score: attempt.total_score,
          total: attempt.selected_questions.reduce((acc, q) => acc + q.marks, 0)
        }
      });
    } catch (error) {
      toast.error("Error submitting test. Please try again.");
    }
  };

  const getOptionClass = (question, option) => {
    if (!submitted) {
      return answers[question.id] === option.id 
        ? 'bg-gray-400 text-white border-gray-400' 
        : 'bg-white text-black border-gray-300 hover:bg-gray-100';
    }
    
    const result = attempt.results.find((r) => r.question === question.id);
    if (!result) return '';

    if (option.id === result.selected_option) {
      return result.scored_marks > 0
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-red-600 text-white border-red-600';
    }
    
    if (option.is_correct && option.id !== result.selected_option) {
      return 'bg-green-600 text-white border-green-600';
    }
    
    return 'bg-white text-black border-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white  text-gray-900 mt-18">
      <h3 className="text-3xl font-semibold mb-6 text-gray-900">{attempt.title}</h3>

      {!submitted && (
        <p className="mb-4 text-gray-600">
          Answer all questions and click Submit when done. Each Question Carries 1 mark.
        </p>
      )}

      {submitted && (
        <p className="mb-4 text-green-600 font-semibold">
          Your score: {attempt.total_score} / {attempt.selected_questions.reduce((acc, q) => acc + q.marks, 0)}
        </p>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {attempt.selected_questions.map((question, qIndex) => (
          <div key={question.id} className="mb-8 p-4 border border-gray-200 rounded-lg">
            <p className="font-small mb-3 text-m">
              {qIndex + 1}. {question.question_text}
            </p>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div 
                  key={option.id}
                  onClick={() => handleOptionSelect(question.id, option.id)}
                  className={`flex items-start p-3 rounded-lg border-1 cursor-pointer transition-colors ${getOptionClass(question, option)}`}
                >
                  <span className="font-small text-sm mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span>{option.option_text}</span>
                </div>
              ))}
            </div>
            {submitted && (
              <p className="mt-3 text-sm text-gray-600">
                {attempt.results.find((r) => r.question === question.id)?.scored_marks > 0
                  ? '✓ Correct answer'
                  : `✗ Incorrect. The correct answer is: ${question.options.find((o) => o.is_correct)?.option_text}`}
              </p>
            )}
          </div>
        ))}

        {!submitted && (
          <Button
            type="submit"
            className="w-full py-6 bg-black hover:bg-gray-950 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        )}

        {submitted && (
          <Button
            type="button"
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all"
            onClick={() => navigate('/my-tests')}
          >
            Back to My Tests
          </Button>
        )}
      </form>
    </div>
  );
};

export default TestAttemptPage;