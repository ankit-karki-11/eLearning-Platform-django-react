import React, { useState } from 'react';
import {
  useGetTopicsQuery,
  useCreateTestMutation,
  useStartAttemptMutation
} from '@/features/api/smarttestApi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Zap, CheckCircle } from 'lucide-react';

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
      console.log('Start Attempt created:', response);
      navigate(`/test-attempts/test/${createdTestId}/attempt/${response.id}/start`);
    } catch (err) {
      console.error('Failed to start attempt:', err);
    }
  };

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="fixed inset-0 -z-10 px-8 py-8 mt-8">
        <img
          src="/16.png"
          alt="background"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute top-10 left-22">
          <Button
            onClick={() => navigate('#')}
            variant="primary"
            className="text-xs font-medium text-white transition-all duration-200 hover:border border-white/20 hover:rounded-lg px-3 py-1.5 backdrop-blur-sm cursor-pointer"
          >
            <span >my tests</span>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-24 relative">
        <div className="p-8 md:p-12 rounded-xl">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-small text-white mb-4 playfair-display italic">
              Generate Smart AI Tests
            </h2>
            <p className="text-sm text-gray-200">
              Get personalized AI tests based on your selected topic and level.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Topic*</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full p-3 text-xs bg-gray-50 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black appearance-none transition-all hover:border-black/40"
                  placeholder="Select topic"
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
                <label className="block text-xs font-medium text-white mb-1">Level*</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 text-xs bg-gray-50 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black appearance-none transition-all hover:border-black/40"
                  disabled={isCreating || isSuccess}
                >
                  <option value="basic">Basic</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1">Test Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test title"
                className="w-full p-3 text-xs bg-white border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black/50 transition-all hover:border-black/40"
                required
                disabled={isCreating || isSuccess}
              />
            </div>

            {/* Submit button */}
            <div className="pt-1">
              {!isSuccess ? (
                <Button
                  type="submit"
                  disabled={!title || !topicId || isCreating}
                  className="w-full py-6 bg-black text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:bg-gray-950 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  {isCreating ? 'Generating questions...' : 'Generate Test'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleStartTest}
                    className="w-full py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:bg-gray-950 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Start Test Now
                  </Button>
                </>
              )}
            </div>

            {isCreating && (
              <div className="mt-4 flex justify-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;