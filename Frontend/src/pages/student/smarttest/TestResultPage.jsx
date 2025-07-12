import { useParams } from 'react-router-dom';
import { useGetAttemptResultsQuery } from '@/features/api/smarttestApi';

function TestResultPage() {
  const { attemptId } = useParams();
  console.log('Results attemptId:', attemptId); // Debug
  const { data: results, isLoading, error } = useGetAttemptResultsQuery({ attemptId });

  if (isLoading) return <div className="max-w-4xl mx-auto p-6 mt-24">Loading results...</div>;
  if (error) return (
    <div className="max-w-4xl mx-auto p-6 mt-24">
      <p className="text-red-600">Error: {error.data?.detail || 'Failed to load results'}</p>
    </div>
  );
  if (!results) return <div className="max-w-4xl mx-auto p-6 mt-24">No results found</div>;

  const totalPossible = results.test.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-24">
      <h2 className="text-2xl font-semibold text-gray-900">Test Results</h2>
   
      <p className="mt-2 text-lg">
        Score: {results.total_score}/{totalPossible}
      </p>
      
      

      <div className="answers mt-6">
        <h3 className="text-lg font-medium">Question Details</h3>
        <ul className="space-y-4">
          {results.answers.map((answer, i) => (
            <li key={answer.id} className="border p-4 rounded">
              <p><strong>Question {i + 1}:</strong> {answer.question_text}</p>
              <p><strong>Your Answer:</strong> {answer.response || 'Not answered'}</p>
              <p><strong>Score:</strong> {answer.scored_marks}/{answer.question.marks}</p>
              <p><strong>Feedback:</strong> {answer.ai_comment}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="feedback mt-4">
        <h3 className="text-lg font-medium">Overall Feedback</h3>
        {results.feedback.split('\n').map((para, i) => (
          <p key={i} className="text-sm text-gray-900 mt-2">{para}</p>
        ))}
      </div>
    </div>
  );
}

export default TestResultPage;