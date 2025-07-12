import { useParams } from 'react-router-dom';
import { 
  useGetTestDetailsQuery, 
  useSubmitAnswerMutation,
  useSubmitAttemptMutation, 
  useGetAttemptQuery 
} from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const TestAttemptPage = () => {
  const { testId, attemptId } = useParams();
  const navigate = useNavigate();
  
  // API hooks
  const { data: test, isLoading, error } = useGetTestDetailsQuery(testId);
  const { data: attempt } = useGetAttemptQuery(attemptId);
  const [submitAnswer, { isLoading: isSubmittingAnswer }] = useSubmitAnswerMutation();
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();
  
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answers, setAnswers] = useState({}); // Store answers locally
  const isSubmitted = attempt?.status === 'submitted';

  // Handle answer input
  const handleAnswerChange = (questionId, response) => {
    setAnswers((prev) => ({ ...prev, [questionId]: response }));
  };

  // Submit individual answer
  const handleSubmitAnswer = async (questionId) => {
    try {
      await submitAnswer({
        attemptId,
        questionId,
        response: answers[questionId] || '',
      }).unwrap();
      console.log('Submit answer response:', response);
      toast.success('Answer submitted.');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit answer.');
      console.error('Submit answer error:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitAttempt({ testId, attemptId }).unwrap();
      setIsDialogOpen(true);
    } catch (err) {
      console.error('Failed to submit test:', err);
      toast.error(err.data?.message || 'Failed to submit test.');
    }
  };

  // Calculate answered questions
  const answeredCount = Object.keys(answers).filter(id => answers[id]?.trim()).length;

  // Loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-12">
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
      </div>
    );
  }

  // Already submitted state
  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Test Submitted Successfully</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Submitted on: {new Date(attempt.completed_at).toLocaleString()}</p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate(`/test-attempts/${attemptId}/results`)}
            >
              View Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal test taking view
  return (
    <div className="max-w-4xl mx-auto p-6 mt-12">
      {/* Test Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{test.title}</h1>
            <p className="text-gray-600 mt-1">
              Topic: <span className="font-medium">{test.topic_title}</span>
            </p>
            <div className="mt-3 flex items-center space-x-4">
              <span className={`text-sm ${
                test.level === 'basic' ? 'text-green-700' :
                test.level === 'medium' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Time limit: {test.time_limit} minutes
              </span>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-800 font-medium">
            Score: 0/{test.questions.length * 2}
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        {test.questions.map((question, index) => (
          <div key={question.id} className="pb-6 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-small text-gray-900">
                Question {index + 1}: {question.question_text}
              </h3>
              <span className="text-sm text-gray-500">
                {question.marks} marks
              </span>
            </div>
            <div className="mt-4">
              <textarea
                className="w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Type your answer here..."
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                disabled={isSubmittingAnswer}
              />
              <Button
                onClick={() => handleSubmitAnswer(question.id)}
                disabled={isSubmittingAnswer || !answers[question.id]?.trim()}
                className="mt-2 bg-gray-900 text-white hover:bg-gray-950"
              >
                {isSubmittingAnswer ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            {/* <p className="text-sm text-gray-600">
              Answered {answeredCount} out of {test.questions.length} questions
            </p> */}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount === 0}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Test'}
          </Button>
        </div>
      </div>

      {/* Submission Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Submitted!</h3>
              <p className="text-sm text-gray-600">
                Your answers have been recorded and AI feedback is being generated.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate(`/test-attempts/${attemptId}/results`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAttemptPage;