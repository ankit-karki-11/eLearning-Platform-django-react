import { useParams } from 'react-router-dom';
// import {  } from '@/features/api/smarttestApi';
import { useGetTestDetailsQuery, useSubmitAttemptMutation } from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestAttemptPage = () => {
  const {testId, attemptId } = useParams();
  const [answers, setAnswers] = useState({});
  const [submitAttempt] = useSubmitAttemptMutation();
  const navigate = useNavigate();
  const { data: test, isLoading, error } = useGetTestDetailsQuery(testId);
    
  const handleSubmit = async () => {
    try {
      await submitAttempt({ testId, attemptId }).unwrap();
      navigate(`/test-attempts/test/${testId}/attempt/${attemptId}/submit`);
    } catch (err) {
      console.error('Failed to submit test:', err);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) {
    // Handle 403 Forbidden
    if (error.status === 403) {
      return (
        <div className="max-w-4xl mx-auto p-6 mt-12">
          <div className="flex items-start text-red-600">
            <svg className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Access Denied</p>
              <p className="text-sm text-gray-600 mt-1">
                You don't have permission to access this test.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Handle other errors
    return (
      <div className="max-w-4xl mx-auto p-6 mt-12">
        <div className="flex items-start text-red-600">
          <svg className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Loading Error</p>
            <p className="text-sm text-gray-600 mt-1">
              Failed to load test. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                {/* {question.question_text} */}
                Question {index + 1}: {question.question_text}
              </h3>
              <span className="text-sm text-gray-500">
                {question.marks} marks
              </span>
            </div>
            
            <div className="mt-4">
              <textarea
                className="w-full p-3 text-sm border border-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-800"
                rows={4}
                placeholder="Type your answer here..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submission Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Answered <span className="font-medium">0</span> out of {test.questions.length} questions
            </p>
          </div>
         <div className="flex space-x-4 gap-2">
             <Button
            className="cursor-pointer"
            variant="outline"
          >
           Save
          </Button>
           <Button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-950 transition-colors cursor-pointer"
          >
            Submit Test
          </Button>
         </div>
        </div>
      </div>    
    </div>
  );
};

export default TestAttemptPage;
