import React, { useState } from 'react';
import {
  useGetTopicsQuery,
  useGetTestsQuery,
  useStartPracticeAttemptMutation,
} from '@/features/api/smarttestApi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Play, BookOpen, Loader2, Check, BookOpenIcon, ListChecks, ListStart, ArrowBigLeftDash, ArrowBigRightDashIcon, Clock } from 'lucide-react';

const CreateTest = () => {
  const navigate = useNavigate();
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('basic');
  const [customTitle, setCustomTitle] = useState('');

  const { data: topics, isLoading: topicsLoading, isError: topicsError, refetch: refetchTopics } = useGetTopicsQuery();
  const { data: adminTests = [], isLoading: testsLoading, isError: testsError } = useGetTestsQuery();
  const [startPracticeAttempt, { isLoading: isStartingAttempt }] = useStartPracticeAttemptMutation();

  const handleStartTest = async (e) => {
    e.preventDefault();

    if (!selectedTopicId) {
      toast.error("Please select a topic.");
      return;
    }

    try {
      const result = await startPracticeAttempt({
        topicId: Number(selectedTopicId),
        level: selectedLevel,
        title: customTitle || undefined
      }).unwrap();

      toast.success("Test started successfully.");
      navigate(`/test-attempts/${result.id}/start`);
    } catch (err) {
      console.error(err);
      toast.error("Could not start the test. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-8 mt-12">
      <div className="max-w-4xl mx-auto space-y-6 ">
        {/* Header */}
        <div className="flex justify-between items-center text-left mb-6 mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">MCQ Test Preparation</h1>
            <p className="text-gray-600">Create practice tests or take admin tests</p>
          </div>
          <Button

            onClick={() => navigate(`/my-tests`)}
            className="bg-black hover:bg-gray-900 text-white px-3 py-1 text-xs cursor-pointer"
          >
            
            <ListChecks size={20} className="h-4 w-4 mr-1" />
            My Tests
          </Button>
        </div>


        {/* Practice Test Creation */}
        <div className="bg-white border border-gray-700 rounded-lg p-6 ">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Practice Test</h2>


          <form onSubmit={handleStartTest} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic*</label>
                {topicsLoading ? (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Loading topics...
                  </div>
                ) : topicsError ? (
                  <div className="text-red-600 text-sm">
                    Failed to load topics.
                    <button
                      onClick={refetchTopics}
                      className="ml-2 underline text-blue-600 hover:text-blue-800"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a Topic</option>
                    {topics?.map((topic) => (
                      <option key={topic.id} value={topic.id}>{topic.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level*</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="basic">Basic</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isStartingAttempt}
              className="w-1/5 bg-black hover:bg-gray-950 text-white px-4 py-2 rounded-md flex items-center justify-center font-small text-sm cursor-pointer"
            >
              {/* <ArrowBigRightDashIcon className="h-4 w-4" /> */}
              {isStartingAttempt ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Starting Test...
                </>
              ) : (
                <>
                  Start Practice Test
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Admin Tests */}
        <div className="bg-white border border-gray-900 rounded-xl p-6 ">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Available Tests</h2>
                <p className="text-sm text-gray-600">Official tests created by Admin</p>
              </div>
            </div>
            {adminTests.length > 0 && (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {adminTests.length} test{adminTests.length !== 1 ? 's' : ''} available
              </div>
            )}
          </div>

          {testsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-3" />
              <p className="text-gray-600">Loading available tests...</p>
            </div>
          ) : testsError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Tests</h3>
              <p className="text-gray-600 mb-4">We couldn't load the available tests. Please try again.</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Refresh Page
              </Button>
            </div>
          ) : adminTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminTests.map((test) => (
                <div
                  key={test.id}
                  className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-950 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {/* Test Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-gray-600">{test.topic?.title || 'General Topic'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Test Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>10 questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>MCQ</span>
                    </div>
                  </div>

                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${test.level === 'basic'
                      ? 'bg-green-100 text-green-800 border border-green-200' :
                      test.level === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                      {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                    </span>

                    <Button
                      onClick={() => navigate(`/tests/${test.id}`)}
                      size="sm"
                      className="bg-gray-900 hover:bg-black text-white px-4 py-2 text-xs cursor-pointer"
                    >
                      Start Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Available</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                There are currently no official tests available. Check back later or create a practice test instead.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Refresh Tests
                </Button>
                <Button
                  onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Practice Test
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateTest;