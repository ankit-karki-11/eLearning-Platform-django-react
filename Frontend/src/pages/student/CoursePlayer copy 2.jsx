import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetEnrolledCourseDetailQuery,
  useMarkSectionAsCompletedMutation,
  useUpdateLastAccessedMutation,
} from '@/features/api/enrollmentApi';
import { ArrowLeft, ArrowRight, Check, CheckCircle, CheckCircle2, Download, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import StartTest from './StartTest';

const CoursePlayer = () => {
  const { slug } = useParams();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEnrolledCourseDetailQuery(slug, {
    refetchOnMountOrArgChange: true,
  });

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const videoRef = useRef(null);

  const [markSectionAsCompleted, { isLoading: marking, error: markError }] =
    useMarkSectionAsCompletedMutation();
  const navigate = useNavigate();
  const [updateLastAccessed] = useUpdateLastAccessedMutation();
  
  // Update last accessed when component mounts
  useEffect(() => {
    if (slug) {
      updateLastAccessed({ courseSlug: slug }).catch((err) =>
        console.error('Failed to update last accessed:', err)
      );
    }
  }, [slug, updateLastAccessed]);

  // Set initial section ID
  useEffect(() => {
    if (!selectedSectionId && data?.course?.sections?.length > 0) {
      setSelectedSectionId(data.course.sections[0].id);
    }
  }, [data, selectedSectionId]);

  // Handle video completion
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !selectedSectionId || data?.course?.sections?.find((s) => s.id === selectedSectionId)?.is_completed) {
      return;
    }

    const handleVideoEnded = async () => {
      try {
        await markSectionAsCompleted({ courseSlug: slug, sectionId: selectedSectionId }).unwrap();
        await refetch();
        const currentIndex = data.course.sections.findIndex((s) => s.id === selectedSectionId);
        if (currentIndex < data.course.sections.length - 1) {
          setSelectedSectionId(data.course.sections[currentIndex + 1].id);
        }
      } catch (error) {
        // console.error('Failed to mark section as completed:', error);
        toast.error('Failed to mark section as completed. Please try again.');
      }
    };

    videoElement.addEventListener('ended', handleVideoEnded);
    return () => videoElement.removeEventListener('ended', handleVideoEnded);
  }, [selectedSectionId, data, slug, markSectionAsCompleted, refetch]);

  // Handle manual section completion
  const handleMarkComplete = async () => {
    try {
      const response = await markSectionAsCompleted({ courseSlug: slug, sectionId: selectedSectionId }).unwrap();
      console.log('Mark section completed response:', response);
      await refetch();
      toast.success('Section marked as completed!');
    } catch (error) {
      console.error('Failed to mark section:', error);
      toast.error('Failed to mark section as completed. Check console for details.');
    }
  };

  // Handle next/previous section navigation
  const handleNextSection = () => {
    const currentIndex = data.course.sections.findIndex((s) => s.id === selectedSectionId);
    if (currentIndex < data.course.sections.length - 1) {
      setSelectedSectionId(data.course.sections[currentIndex + 1].id);
    }
  };

  const handlePreviousSection = () => {
    const currentIndex = data.course.sections.findIndex((s) => s.id === selectedSectionId);
    if (currentIndex > 0) {
      setSelectedSectionId(data.course.sections[currentIndex - 1].id);
    }
  };

  const handleCertificate = () => {
    navigate(`/certificate/${slug}/`);
  }

  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gray-200 aspect-video rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg text-center">
          <p className="font-medium">Failed to load course</p>
          <p className="text-sm mt-2">{error?.data?.detail || 'Please refresh or try again later'}</p>
        </div>
      </div>
    );
  }

  if (!data?.course || !data.course.sections?.length) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-6 rounded-lg text-center">
          <p className="font-medium">Course content unavailable</p>
          <p className="text-sm mt-2">This course doesn't have any sections yet</p>
        </div>
      </div>
    );
  }

  const { course } = data;
  const selectedSection = course.sections.find((s) => s.id === selectedSectionId);
  const completedCount = course.sections.filter((s) => s.is_completed).length;
  const isCourseCompleted = completedCount === course.sections.length;
  const progressPercentage = data.progress || (completedCount / course.sections.length) * 100;

  const isTestRequired = !data?.course?.is_test_required;

  if (!selectedSection) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-16">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <div className="flex items-center gap-4">
          <div className="w-1/5 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}

            ></div>
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {completedCount} of {course.sections.length} completed
          </span>
          {isCourseCompleted && (
            <span className="text-xs text-green-600 bg-blufont-semibold">{data?.status}</span>
            // <span className="text-xs text-green-600 bg-blufont-semibold">Completed</span>
          )}
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <main className="md:col-span-2 space-y-6">
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            {selectedSection.video_url ? (
              <video
                ref={videoRef}
                src={selectedSection.video_url}
                controls
                className="w-full bg-black"
                onError={() => setVideoError('Failed to load video. Please try again.')}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400 bg-gray-100">
                <div className="text-center p-6">
                  <p className="font-medium">No video available</p>
                  <p className="text-sm mt-1">This section doesn't have content yet</p>
                  {!selectedSection.is_completed && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={marking}
                      className={`mt-4 px-4 py-2 rounded ${marking ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {marking ? 'Marking...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              </div>
            )}
            {videoError && (
              <div className="text-red-600 text-sm mt-2 text-center">{videoError}</div>
            )}
            {markError && (
              <div className="text-red-600 text-sm mt-2 text-center">
                {markError?.data?.detail || 'Failed to mark section as completed'}
              </div>
            )}
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handlePreviousSection}
              disabled={course.sections.findIndex((s) => s.id === selectedSectionId) === 0}
              className='px-4 py-2 text-sm cursor-pointer'
              variant='outline'

            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNextSection}
              disabled={course.sections.findIndex((s) => s.id === selectedSectionId) === course.sections.length - 1}
              className='px-4 py-2 cursor-pointer '
            // variant='secondary'
            >

              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-3">{selectedSection.title}</h2>
            <p className="text-gray-600">
              {selectedSection.description || 'No description provided for this section.'}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-3">About Course</h2>
            <p className="text-gray-600">
              {course.title || 'No title provided for this course.'}
              {course.description || 'No description provided for this course.'}
              {course.category || 'No category provided for this course.'}
            </p>
          </div>
        </main>

        <aside className="space-y-4">
          <div className="bg-white   overflow-hidden">
            <div className="p-4 border-b border-gray-100 ">
              <h2 className="font-semibold">Course Sections</h2>
            </div>
            <div className="divide-y">
              {course.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`w-full text-left p-4 transition-colors ${selectedSectionId === section.id ? 'rounded-2xl' : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${section.is_completed ? ' text-green-600' : ' text-gray-500'
                        }`}
                    >
                      {section.is_completed ? <CheckCircle size={16} /> : <Play size={16} />}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-sm font-small truncate ${selectedSectionId === section.id ? 'text-blue-600' : 'text-gray-700'
                          }`}
                      >
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">Section {section.order}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>

          <div className="p-4 mt-4 border rounded-lg bg-gray-50 space-y-3">

            {/* If course sections are not yet completed */}
            {!isCourseCompleted && (
              <p className="text-sm text-gray-600">
                Complete all sections to unlock your test
                {isTestRequired ? ' and certificate' : ''}
              </p>
            )}

            {/* If sections completed */}
            {isCourseCompleted && isTestRequired && (
              <>
                {/* If test is required and not passed yet */}
                {!data.is_test_passed && (
                  <>
                    <p className="text-sm text-gray-600">
                      You have completed all sections. Complete the test to unlock your certificate.
                    </p>
                    <Button
                      onClick={() => navigate(`/course/${slug}/test`)}
                      variant="default"
                      className="w-full cursor-pointer"
                    >
                      Give Test
                    </Button>
                  </>
                )}

                {/* If test passed */}
                {data.is_test_passed && (
                  <Button
                    onClick={handleCertificate}
                    variant="default"
                    className="w-full cursor-pointer"
                  >
                    <Download className="mr-1" />
                    View your Certificate
                  </Button>
                )}
              </>
            )}

            {/* Courses with no test required */}
            {isCourseCompleted && !isTestRequired && (
              <p className="text-sm text-gray-600">
                Course completed! No formal test required, so no certificate available.
              </p>
            )}
          </div>




        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;