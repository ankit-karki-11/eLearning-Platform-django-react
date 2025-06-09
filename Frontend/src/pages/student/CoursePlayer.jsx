import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CirclePlayIcon, Video } from 'lucide-react';
import { useGetEnrolledCourseDetailQuery } from '@/features/api/enrollmentApi';

const CoursePlayer = () => {
  const { slug } = useParams();
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const { data: enrolledCourse, isLoading, isError } = useGetEnrolledCourseDetailQuery(slug);

  if (isLoading) return <p>Loading course...</p>;
  if (isError) return <p>Error loading course details.</p>;
  if (!enrolledCourse || !Array.isArray(enrolledCourse.sections)) {
    console.log('Error: Course data  or sections is missing or invalid.');
    
    return <p>No course found or sections are unavailable.</p>;
  }

  const { title, sections } = enrolledCourse;
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="max-w-7xl mx-auto p-4 mt-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <Button disabled>Completed</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Main video/content area */}
        <div className="flex-1 md:w-3/5 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-10 h-10" />
            <h3 className="text-lg font-bold">
              {selectedSection ? selectedSection.title : 'Select a section'}
            </h3>
          </div>

          {/* Placeholder for video or content */}
          {selectedSection ? (
            <video
              src={selectedSection.video_url || ''}
              controls
              className="w-full rounded"
            />
          ) : (
            <p>Please select a section from the sidebar.</p>
          )}
        </div>

        {/* Sidebar with sections */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l md-pl-4 pt-4 md-pt-4 border-gray-300">
          <h2 className="font-semibold text-xl mb-4">Sections</h2>

          <div className="flex-1 overflow-auto">
            {sections.map((section) => (
              <Card
                key={section.id}
                className="mb-2 hover:cursor-pointer transition transform"
                onClick={() => setSelectedSectionId(section.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    {section.is_completed ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlayIcon size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">{section.title}</CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${section.is_completed
                      ? 'text-green-600 border-green-600'
                      : 'text-gray-600 border-gray-400'
                      }`}
                  >
                    {section.is_completed ? 'Completed' : 'In Progress'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
