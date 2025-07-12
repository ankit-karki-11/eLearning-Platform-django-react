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
      <div className="fixed inset-0 -z-10 px-12 py-8 mt-8">
        <img 
          src="/14.png" 
          alt="background"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-24 relative">
        <div className=" p-8 md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-2">Create AI-Powered Assessment</h2>
            <p className="text-black/80">Generate a customized test in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Topic*</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full p-3 text-sm bg-black/5 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black appearance-none transition-all hover:border-black/40"
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
                <label className="block text-sm font-medium text-black mb-1">Level*</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 text-sm bg-black/5 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black appearance-none transition-all hover:border-black/40"
                  disabled={isCreating || isSuccess}
                >
                  <option value="basic">Basic</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Test Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test title"
                className="w-full p-3 text-sm bg-black/5 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black/50 transition-all hover:border-black/40"
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
                  className="w-full py-6 bg-black hover:bg-gray-950 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isCreating ? 'Generating questions...' : 'Generate Test'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleStartTest}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    Start Test Now
                  </Button>
                  <div className="mt-4 animate-bounce text-center text-green-400">
                    <CheckCircle className="w-6 h-6 mx-auto" />
                    <p className="mt-2">Test created successfully!</p>
                  </div>
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