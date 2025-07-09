import React, { useState } from 'react';
import { 
  useGetTopicsQuery, 
  useCreateTestMutation,
  useGetMyTestsQuery 
} from '@/features/api/smarttestApi';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('');
  const [level, setLevel] = useState('basic');
  const [createdTestId, setCreatedTestId] = useState(null);

  // API Hooks
  const { data: topics = [] } = useGetTopicsQuery();
  const { data: myTests = [], refetch: refetchTests } = useGetMyTestsQuery();
  const [createTest, { isLoading: isCreating, isSuccess }] = useCreateTestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createTest({ title, topic_id: topicId, level }).unwrap();
      setCreatedTestId(result.id);
      refetchTests(); // Refresh the tests list
    } catch (err) {
      console.error('Failed to create test:', err);
    }
  };

  return (
    <div className="mt-12 p-6 max-w-6xl mx-auto space-y-8">
      {/* Test Creation Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Create New Test</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Test Title */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assessment title"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              disabled={isCreating || isSuccess}
            />
          </div>

          {/* Topic Select */}
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic*</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              disabled={isCreating || isSuccess}
            >
              <option value="">Select topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </div>

          {/* Level Select */}
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level*</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              disabled={isCreating || isSuccess}
            >
              <option value="basic">Basic</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto">
            {!isSuccess ? (
              <button
                onClick={handleSubmit}
                disabled={!title || !topicId || isCreating}
                className={`w-full md:w-32 py-2 px-4 rounded-md text-white ${
                  !title || !topicId || isCreating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating
                  </span>
                ) : 'Create'}
              </button>
            ) : (
              <button
                onClick={() => navigate(`/smart-test/test/${createdTestId}/start`)}
                className="w-full md:w-32 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Start Test
              </button>
            )}
          </div>
        </div>

        {isCreating && (
          <div className="mt-3 text-sm text-blue-600 flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating questions...
          </div>
        )}
      </div>

      {/* My Tests List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">My Tests</h2>
        {myTests.length === 0 ? (
          <p className="text-gray-500">You haven't created any assessments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myTests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.topic_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        test.level === 'basic' ? 'bg-green-100 text-green-800' :
                        test.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                       onClick={() => navigate(`/smart-test/test/${createdTestId}/start`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Start
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTest;