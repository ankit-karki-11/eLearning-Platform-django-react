import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEnrolledCourseDetailQuery } from '@/features/api/enrollmentApi';
import { Check, Play } from 'lucide-react';

const CoursePlayer = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetEnrolledCourseDetailQuery(slug);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-2/3 mb-6"></div>
      <div className="h-4 bg-gray-100 rounded w-full mb-8"></div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gray-100 aspect-video rounded-lg"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-lg text-center">
        <p className="font-medium">Failed to load course</p>
        <p className="text-sm mt-2">Please refresh or try again later</p>
      </div>
    </div>
  );

  if (!data?.course) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-50 border border-gray-100 text-gray-600 p-6 rounded-lg text-center">
        <p className="font-medium">Course content unavailable</p>
        <p className="text-sm mt-2">This course doesn't have any sections yet</p>
      </div>
    </div>
  );

  const { course, progress } = data;
  const selectedSection = course.sections.find(s => s.id === selectedSectionId) || course.sections[0];
  const completedCount = course.sections.filter(s => s.is_completed).length;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {completedCount} of {course.sections.length} completed
          </span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <main className="md:col-span-2 space-y-6">
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            {selectedSection?.video_url ? (
              <video
                src={selectedSection.video_url}
                controls
                className="w-full aspect-video bg-black"
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400">
                <div className="text-center p-6">
                  <p className="font-medium">No video available</p>
                  <p className="text-sm mt-1">This section doesn't have content yet</p>
                </div>
              </div>
            )}
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
              {course.description|| 'No description provided for this section.'}
            </p>
               <p className="text-gray-600">
              {course.syllabus|| 'No syllabus provided for this section.'}
            </p>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold">Course Sections</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {course.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedSectionId === section.id 
                      ? 'bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      section.is_completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {section.is_completed ? (
                        <Check size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-sm font-medium truncate ${
                        selectedSectionId === section.id ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Section {section.position}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;