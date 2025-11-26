import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetEnrolledCourseDetailQuery,
  useMarkSectionAsCompletedMutation,
  useUpdateLastAccessedMutation,
} from '@/features/api/enrollmentApi';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Download, Play, Clock, Award, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  const [activeTab, setActiveTab] = useState('content');
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Loading */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        {/* Main Content Loading */}
        <div className="flex-1 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="bg-gray-200 aspect-video rounded-lg mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-md">
          <p className="font-semibold text-gray-900 mb-2">Failed to load course</p>
          <p className="text-sm text-gray-600">{error?.data?.detail || 'Please refresh or try again later'}</p>
        </div>
      </div>
    );
  }

  if (!data?.course || !data.course.sections?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-md">
          <p className="font-semibold text-gray-900 mb-2">Course content unavailable</p>
          <p className="text-sm text-gray-600">This course doesn't have any sections yet</p>
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
    <div className="min-h-screen bg-gray-50 flex mt-12">
      {/* Sidebar - Course Sections */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Course Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h1>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            {completedCount} of {course.sections.length} sections completed
          </p>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            {course.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                className={`w-full text-left p-3 mb-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  selectedSectionId === section.id 
                    ? 'bg-black text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex-shrink-0">
                  {section.is_completed ? (
                    <CheckCircle size={18} className={selectedSectionId === section.id ? 'text-white' : 'text-green-600'} />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSectionId === section.id ? 'border-white' : 'border-gray-300'
                    }`}>
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{section.title}</h3>
                  <p className={`text-xs mt-1 ${
                    selectedSectionId === section.id ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Section {section.order}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="bg-white border-b border-gray-200">
          <div className="aspect-video bg-black rounded-none overflow-hidden">
            {selectedSection.video_url ? (
              <video
                ref={videoRef}
                src={selectedSection.video_url}
                controls
                className="w-full h-full"
                onError={() => setVideoError('Failed to load video. Please try again.')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-gray-900">
                <div className="text-center">
                  <Play size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="font-medium mb-2">No video available</p>
                  <p className="text-sm text-gray-400 mb-4">This section doesn't have content yet</p>
                  {!selectedSection.is_completed && (
                    <Button
                      onClick={handleMarkComplete}
                      disabled={marking}
                      variant="secondary"
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      {marking ? 'Marking...' : 'Mark as Completed'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between items-center p-4 bg-gray-50">
            <Button
              onClick={handlePreviousSection}
              disabled={course.sections.findIndex((s) => s.id === selectedSectionId) === 0}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <h2 className="font-medium text-gray-900 text-center flex-1 mx-4">
              {selectedSection.title}
            </h2>
            
            <Button
              onClick={handleNextSection}
              disabled={course.sections.findIndex((s) => s.id === selectedSectionId) === course.sections.length - 1}
              size="sm"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="flex-1 bg-white">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="inline w-4 h-4 mr-2" />
                Content
              </button>
              
              <button
                onClick={() => setActiveTab('test')}
                disabled={!isCourseCompleted}
                className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'test' && isCourseCompleted
                    ? 'border-black text-black'
                    : !isCourseCompleted
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Clock className="inline w-4 h-4 mr-2" />
                Test
              </button>
              
              <button
                onClick={() => setActiveTab('certificate')}
                disabled={!data.is_test_passed}
                className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'certificate' && data.is_test_passed
                    ? 'border-black text-black'
                    : !data.is_test_passed
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="inline w-4 h-4 mr-2" />
                Certificate
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {selectedSection.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedSection.description || 'No description provided for this section.'}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description || 'No description provided for this course.'}
                  </p>
                  {course.category && (
                    <p className="text-sm text-gray-500 mt-2">
                      Category: {course.category}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="text-center py-12">
                {!isCourseCompleted ? (
                  <div>
                    <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete All Sections First</h3>
                    <p className="text-gray-600 mb-6">
                      You need to complete all course sections before taking the test.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-gray-600">
                        Progress: {completedCount} of {course.sections.length} sections completed
                      </p>
                    </div>
                  </div>
                ) : !data.is_test_passed ? (
                  <div>
                    <Clock size={48} className="mx-auto mb-4 text-black" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Take the Test</h3>
                    <p className="text-gray-600 mb-6">
                      Great job completing all sections! Now take the test to earn your certificate.
                    </p>
                    <Button
                      onClick={() => navigate(`/course/${slug}/test`)}
                      size="lg"
                      className="bg-black hover:bg-gray-800"
                    >
                      Start Test
                    </Button>
                  </div>
                ) : (
                  <div>
                    <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Completed!</h3>
                    <p className="text-gray-600">
                      Congratulations! You've successfully passed the test.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificate' && (
              <div className="text-center py-12">
                {!data.is_test_passed ? (
                  <div>
                    <Award size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Locked</h3>
                    <p className="text-gray-600">
                      Complete the course and pass the test to unlock your certificate.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Award size={48} className="mx-auto mb-4 text-black" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Ready!</h3>
                    <p className="text-gray-600 mb-6">
                      Congratulations on completing the course! Your certificate is ready to download.
                    </p>
                    <Button
                      onClick={handleCertificate}
                      size="lg"
                      className="bg-black hover:bg-gray-800"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;