import { useLocation, useParams } from 'react-router-dom';
import { useGetAttemptResultsQuery } from '@/features/api/smarttestApi';

const TestFeedbackPage = () => {
  const { testId, attemptId } = useParams();
  const location = useLocation();
  
  // Fetch the detailed results
  const { data: results, isLoading, error } = useGetAttemptResultsQuery({ testId, attemptId });

  if (isLoading) return <div>Loading feedback...</div>;
  if (error) return <div>Error loading feedback</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test Results</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Overall Performance</h2>
        <p>Score: {results.score} / {results.total_marks}</p>
        {/* Add more summary metrics as needed */}
      </div>

      <div className="space-y-4">
        {results.feedback_by_question?.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h3 className="font-medium">Question {index + 1}: {item.question_text}</h3>
            <p className="mt-2">Your answer: {item.user_answer}</p>
            <p className="mt-1">Score: {item.score} / {item.max_marks}</p>
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <h4 className="font-medium">Feedback:</h4>
              <p>{item.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestFeedbackPage;