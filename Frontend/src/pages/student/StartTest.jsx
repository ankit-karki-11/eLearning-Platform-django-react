import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEnrolledCourseDetailQuery } from "@/features/api/enrollmentApi";
import { useGetTestsQuery, useStartAttemptMutation } from "@/features/api/smarttestApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Award, CheckCircle, ArrowRight, BookOpen } from "lucide-react";

const StartTest = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading: courseLoading, isError: courseError } =
    useGetEnrolledCourseDetailQuery(slug);

  const { data: testsData, isLoading: testsLoading, isError: testsError } = useGetTestsQuery();
  const [startAttempt, { isLoading: startingAttempt }] = useStartAttemptMutation();

  const [formalTest, setFormalTest] = useState(null);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    if (courseData && testsData) {
      const courseId = courseData.course.id;
      const allSectionsCompleted = courseData.course.sections.every((s) => s.is_completed);
      setCanStart(allSectionsCompleted);

      // Find formal (non-practice) test
      const test = testsData.find(
        (t) => String(t.course) === String(courseId) && !t.is_practice
      );
      setFormalTest(test || null);
    }
  }, [courseData, testsData]);

  const handleStartTest = async () => {
    if (!formalTest) return toast.error("Formal test not found.");
    if (!canStart) return toast.error("Complete all sections before starting the test.");

    try {
      const attempt = await startAttempt(formalTest.id).unwrap();
      toast.success("Test started!");
      navigate(`/course/${slug}/attempt/${attempt.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start test. Try again.");
    }
  };

  if (courseLoading || testsLoading) {
    return (
      <div className="max-w-md mx-auto p-6 mt-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (courseError || testsError) {
    return (
      <div className="max-w-md mx-auto p-6 mt-16 text-center">
        <div className="text-red-600 mb-4">Failed to load course data</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const isTestRequired = courseData.is_test_required;

  if (!isTestRequired) {
    return (
      <div className="max-w-md mx-auto p-6 mt-16 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{courseData.course.title}</h1>
        <p className="text-gray-600 mb-6">This course does not include a final test.</p>
        <Button onClick={() => navigate(`/course/${slug}`)} variant="outline">
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-16">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Final Assessment</h1>
        <p className="text-gray-600">{courseData.course.title}</p>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Test Format</p>
            <p className="text-sm text-gray-600">Formal assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Award className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Total Marks</p>
            <p className="text-sm text-gray-600">10 points</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Passing Score</p>
            <p className="text-sm text-gray-600">6 points (60%)</p>
          </div>
        </div>
      </div>

      {!formalTest ? (
        <div className="text-center text-gray-600 mb-6">
          Test content is being prepared. Please check back later.
        </div>
      ) : !canStart ? (
        <div className="text-center text-gray-600 mb-6">
          Complete all course sections to unlock this test.
        </div>
      ) : (
        <div className="text-center">
          <Button
            onClick={handleStartTest}
            disabled={startingAttempt}
            className="w-full py-3 text-base font-medium"
            size="lg"
          >
            {startingAttempt ? (
              "Preparing Test..."
            ) : (
              <>
                Start Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            You can retake the test if needed
          </p>
        </div>
      )}

      <div className="text-center mt-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/course/${slug}/progress`)}
          className="text-sm text-gray-600"
        >
          Back to Course Content
        </Button>
      </div>
    </div>
  );
};

export default StartTest;