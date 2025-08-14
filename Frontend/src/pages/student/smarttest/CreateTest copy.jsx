import React, { useState } from 'react';
import {
  useGetTopicsQuery,
  useGetTestsQuery,
  useStartPracticeAttemptMutation,
} from '@/features/api/smarttestApi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Play, BookOpen, Loader2, Check, BookOpenIcon, ListChecks } from 'lucide-react';

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
          {/* Left side: Title and description */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">MCQ Test Preparation</h1>
            <p className="text-gray-600">Create practice tests or take admin tests</p>
          </div>

          {/* Right side: Button */}
          
          <Button
          
            onClick={() => navigate(`/my-tests`)}
            className="bg-black hover:bg-gray-900 text-white px-3 py-1 text-xs cursor-pointer"
          >
            {/* <BookOpenIcon className="h-4 w-4 mr-1" /> */}
            <ListChecks size={20} className="h-4 w-4 mr-1"/>
            My Test
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
              className="w-1/2 mx-auto bg-black hover:bg-gray-950 text-white px-4 py-2 rounded-md flex items-center justify-center font-medium text-sm cursor-pointer"
            >
              {isStartingAttempt ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Starting Test...
                </>
              ) : (
                <>
                  {/* <Play className="h-4 w-4 mr-2" /> */}
                  Start Practice Test
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Admin Tests */}
        <div className="bg-white border border-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tests For You</h2>

          {testsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
            </div>
          ) : testsError ? (
            <div className="text-center py-6 text-red-600 text-sm">
              Failed to load admin tests. Please try again later.
            </div>
          ) : adminTests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {adminTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white border border-gray-200 p-4 rounded-lg hover:border-gray-300 "
                >
                  <div className="mb-3">
                    <h3 className="text- font-medium text-gray-800">{test.title}</h3>
                    <p className="text-xs text-gray-500">Topic: {test.topic.title || 'General'}</p>
                  </div>md
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.level === 'basic' ? 'bg-green-100 text-green-800' :
                      test.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                    </span>
                    <Button
                      onClick={() => navigate(`/tests/${test.id}`)}
                      className="bg-black hover:bg-gray-800 text-small text-white px-2 py-1 text-xs"
                    >
                      Give Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
              <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-md font-medium text-gray-700">No tests available</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTest;