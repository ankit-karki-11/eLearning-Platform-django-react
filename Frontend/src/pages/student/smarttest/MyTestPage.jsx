import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyAttemptsQuery } from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, CheckCircle, AlertCircle, Loader2, List, PlusCircle } from 'lucide-react';

const MyTestPage = () => {
  const navigate = useNavigate();
  const { data: attempts = [], isLoading, isError } = useGetMyAttemptsQuery();

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  if (isError) return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-red-50 rounded-lg text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to load your tests</h2>
      <p className="text-gray-600 mb-4">Please try again later</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );

  if (attempts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 text-center bg-gray-50 rounded-xl mt-24">
        <List className="h-12 w-12 text-black mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">No Tests Attempted Yet</h1>
        <p className="text-gray-600 mb-6">Start practicing to see your attempts here</p>
        <Button className='cursor-pointer' onClick={() => navigate('/smart-test/test')}>
          Start Your First Test
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-4 sm:px-6 mt-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Test Attempts</h1>
          <p className="text-gray-600 mt-1">{attempts.length} total attempts</p>
        </div>
        <Button onClick={() => navigate('/smart-test/test')} className="cursor-pointer">
          <PlusCircle className="h-4 w-4 mr-1" />
          New Test
        </Button>
      </div>

      <div className="space-y-4">
        {attempts.map((attempt) => {
          const isSubmitted = attempt.status === 'submitted';
          const percentage = isSubmitted ? Math.round((attempt.total_score / 10) * 100) : null;
          
          return (
            <div 
              key={attempt.id} 
              className="p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-900 transition-all cursor-pointer"
              onClick={() => isSubmitted 
                ? navigate(`/test-results/${attempt.id}`) 
                : navigate(`/test-attempts/${attempt.id}/start`)
              }
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold flex items-center">
                    {attempt.title}
                    {isSubmitted ? (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500 ml-2" />
                    )}
                  </h2>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium mr-3 ${
                      isSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isSubmitted ? 'Completed' : 'In Progress'}
                    </span>
                    {/* <span>{new Date(attempt.created_at).toLocaleDateString()}</span> */}
                    {/* <span>{attempt.created_at}</span> */}
                  </div>
                </div>
                
                {isSubmitted && (
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {attempt.total_score}/10
                    </div>
                    <div className={`text-xs font-medium ${
                      percentage >= 70 ? 'text-green-600' : 
                      percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {percentage}%
                    </div>
                  </div>
                )}
              </div>

              {isSubmitted && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage >= 70 ? 'bg-green-500' : 
                        percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4 space-x-2 ">
                <Button 
                  className="cursor-pointer"
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    isSubmitted 
                      ? navigate(`/test-results/${attempt.id}`)
                      : navigate(`/test-attempts/${attempt.id}/start`);
                  }}
                >
                  {isSubmitted ? 'View Result' : 'Continue Test'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTestPage;