import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CirclePlayIcon, Video } from 'lucide-react';
import React, { useState } from 'react';

import { useGetCourseSectionProgressQuery, useGetEnrolledCourseDetailQuery } from '@/features/api/enrollmentApi';

const CourseProgress = () => {
  const { slug } = useParams();
  const [currentSectionId, setCurrentSectionId] = useState(null);

  // Get enrolled course detail (includes sections)
  const { data: enrolledCourse, isLoading, isError } = useGetEnrolledCourseDetailQuery(slug);

  // Get progress for selected section
  const { data: sectionProgress } = useGetCourseSectionProgressQuery(
    { courseSlug: slug, sectionId: currentSectionId },
    { skip: !currentSectionId }
  );

  const sections = enrolledCourse?.sections || [];
  const courseTitle = enrolledCourse?.title || slug;

  return (
    <div className='max-w-7xl mx-auto p-4 mt-24'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold capitalize'>{courseTitle}</h1>
        <Button>Completed</Button>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        {/* Main Video Area */}
        <div className='flex-1 md:w-3/5 g-fit rounded-lg shadow-lg p-4'>
          <div>
            <Video className='w-10 h-10' />
            {/* In production: use <video src={sectionProgress?.video_url} controls /> */}
          </div>

          <div className='mt-2'>
            <h3 className='text-lg font-bold'>
              Current Section: {
                sections.find((s) => s.id === currentSectionId)?.title || 'None selected'
              }
            </h3>
          </div>
        </div>

        {/* Sidebar */}
        <div className='flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l md-pl-4 pt-4 md-pt-4 border-gray-300'>
          <h2 className='font-semibold text-xl mb-4'>Sections</h2>

          <div className='flex-1 overflow-auto'>
            {isLoading && <p>Loading sections...</p>}
            {isError && <p>Error loading course details</p>}

            {sections.map((section) => (
              <Card
                key={section.id}
                className='mb-2 hover:cursor-pointer transition transform'
                onClick={() => setCurrentSectionId(section.id)}
              >
                <CardContent className='flex items-center justify-between p-4'>
                  <div className='flex items-center gap-2'>
                    {section.is_completed ? (
                      <CheckCircle2 size={24} className='text-green-500 mr-2' />
                    ) : (
                      <CirclePlayIcon size={24} className='text-gray-500 mr-2' />
                    )}
                    <div>
                      <CardTitle className='text-lg font-medium'>
                        {section.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      section.is_completed
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

export default CourseProgress;
