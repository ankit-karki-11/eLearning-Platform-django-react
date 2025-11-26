import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetEnrolledCourseDetailQuery } from '@/features/api/enrollmentApi';
import { useGetTestsQuery, useStartAttemptMutation } from '@/features/api/smarttestApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const StartTest = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Get enrolled course details
  const { data: courseData, isLoading: courseLoading } = useGetEnrolledCourseDetailQuery(slug);
  
  // Get all tests
  const { data: testsData, isLoading: testsLoading } = useGetTestsQuery();
  
  const [startAttempt, { isLoading: startingAttempt }] = useStartAttemptMutation();

  const [formalTest, setFormalTest] = useState(null);

  // Select formal test for this course
  useEffect(() => {
    if (courseData && testsData) {
      const courseId = courseData.course.id;
      const test = testsData.find(t => t.course === courseId && !t.is_practice);
      setFormalTest(test || null);
    }
  }, [courseData, testsData]);

  const handleStartTest = async () => {
    if (!formalTest) return toast.error('Formal test not found for this course.');

    try {
      const attempt = await startAttempt(formalTest.id).unwrap();
      toast.success('Test started!');
      navigate(`/course/${slug}/attempt/${attempt.id}`); // Redirect to test attempt page
    } catch (err) {
      console.error(err);
      toast.error('Failed to start test. Try again.');
    }
  };

  if (courseLoading || testsLoading) {
    return <p>Loading...</p>;
  }

  if (!formalTest) {
    return <p>Test not yet created for this course.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-4">{courseData.course.title} - Formal Test</h1>
      <p className="mb-6">You have completed all sections. Click below to start your formal test.</p>
      <Button
        onClick={handleStartTest}
        disabled={startingAttempt}
        className="w-full"
      >
        {startingAttempt ? 'Starting...' : 'Start Test'}
      </Button>
    </div>
  );
};

export default StartTest;
