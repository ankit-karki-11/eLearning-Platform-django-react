import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAttemptDetailsQuery } from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';

const TestResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const { data: attempt, isLoading, isError } = useGetAttemptDetailsQuery(attemptId);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isError) return (
    <div className="max-w-4xl mx-auto p-6 text-center py-12">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error loading test results. Please try again later.
      </div>
      <Button 
        className="mt-4" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
      </Button>
    </div>
  );

  const totalMarks = attempt.selected_questions.reduce((acc, q) => acc + q.marks, 0);
  const userScore = attempt.total_score;
 
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 mt-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Test Results</h1>
          <p className="text-gray-600">{attempt.title}</p>
        </div>
        
       
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{userScore}</div>
            <div className="text-gray-500">Your Score</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-700">{totalMarks}</div>
            <div className="text-gray-500">Total Marks</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {attempt.selected_questions.filter(q => 
                attempt.results.find(r => r.question === q.id)?.scored_marks > 0
              ).length}
            </div>
            <div className="text-gray-500">Correct Answers</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Question Breakdown</h2>
        {attempt.selected_questions.map((question, idx) => {
          const result = attempt.results.find(r => r.question === question.id);
          const selectedOptionId = result?.selected_option;
          const selectedOption = question.options.find(o => o.id === selectedOptionId);
          const correctOption = question.options.find(o => o.is_correct);
          const isCorrect = result?.scored_marks > 0;

          return (
            <div key={question.id} className={`p-5 rounded-lg border ${isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
              <div className="flex items-start mb-3">
                <div className="mr-3 mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {idx + 1}. {question.question_text}
                  </p>
                  <div className="mt-3">
                    <p className="text-sm">
                      <span className="font-medium">Your answer:</span>{' '}
                      <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {selectedOption ? selectedOption.option_text : 'No answer selected'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Correct answer:</span>{' '}
                        <span className="text-green-600">{correctOption.option_text}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          className="py-3 px-6 border-gray-300 text-gray-700"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Test
        </Button>
        <Button
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/my-tests')}
        >
          View All Tests
        </Button>
      </div>
    </div>
  );
};

export default TestResultPage;