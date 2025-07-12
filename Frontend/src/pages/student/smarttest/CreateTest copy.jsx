import React, { useState } from 'react';
import {
  useGetTopicsQuery,
  useCreateTestMutation,
  useStartAttemptMutation
} from '@/features/api/smarttestApi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Zap } from 'lucide-react';

const CreateTest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('');
  const [level, setLevel] = useState('basic');
  const [createdTestId, setCreatedTestId] = useState(null);

  // API Hooks
  const { data: topics = [] } = useGetTopicsQuery();
  const [createTest, { isLoading: isCreating, isSuccess }] = useCreateTestMutation();
  const [startAttempt] = useStartAttemptMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createTest({ title, topic_id: topicId, level }).unwrap();
      setCreatedTestId(result.id);
      toast.success(result.message || "Test created successfully.");
    } catch (err) {
      toast.error(err.data?.message || "Failed to create test.");
      console.error('Failed to create test:', err);
    }
  };

  const handleStartTest = async () => {
    try {
    const response = await startAttempt(createdTestId).unwrap();
    console.log('Start Attempt created:', response);  // Verify response structure
    navigate(`/test-attempts/test/${createdTestId}/attempt/${response.id}/start`);
    // toast.success(response.message || "Test started successfully.");
  } catch (err) {
    console.error('Failed to start attempt:', err);
    // toast.error(err.data?.message || "Failed to start test.");
  }
};

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 mt-24">
      
      {/* Test Creation Form */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Test Your Knowledge and Skills</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Form fields remain the same */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Test title"
                className="w-full p-2 text-sm border border-gray-900 rounded-sm focus:ring-1 focus:ring-blue-500"
                required
                disabled={isCreating || isSuccess}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic*</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full p-2 text-sm border border-gray-900 rounded-sm focus:ring-1 focus:ring-blue-500"
                required
                disabled={isCreating || isSuccess}
              >
                <option value="">Select topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level*</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 text-sm border border-gray-900 rounded-sm focus:ring-1 focus:ring-blue-500"
                disabled={isCreating || isSuccess}
              >
                <option value="basic">Basic</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            {!isSuccess ? (
              <Button
                type="submit"
                disabled={!title || !topicId || isCreating}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-950"
              >
               <Zap className="w-4 h-4 text-amber-50" />
                {isCreating ? 'Creating Test...' : 'Create Test'}
                
              </Button>
            ) : (
              <Button
                onClick={handleStartTest}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700"
              >
                   <Zap className="w-4 h-4 text-amber-50" />
                Start Test
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2>test your knowledge</h2>

      </div>
    </div>
  );
};

export default CreateTest;