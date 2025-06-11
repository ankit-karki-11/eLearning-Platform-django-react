import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CirclePlayIcon, Video, Clock, BookOpen, Award, AlertCircle } from 'lucide-react';
import { useGetEnrolledCourseDetailQuery } from '@/features/api/enrollmentApi';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CoursePlayer = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetEnrolledCourseDetailQuery(slug);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  if (isLoading) return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-20">
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3 rounded-lg" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-2 w-full max-w-md rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Skeleton className="aspect-video w-full rounded-xl" />
          </div>
          <div className="w-full lg:w-96 space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-20">
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-6 text-destructive">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-10 h-10" />
            <p className="text-lg font-medium">Error loading course details</p>
            <p className="text-sm">Please try again later or contact support</p>
            <Button variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!data || !data.course) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 mt-20">
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="p-6 text-center text-gray-600">
            <div className="flex flex-col items-center justify-center space-y-3">
              <BookOpen className="w-10 h-10 text-gray-400" />
              <p className="text-lg font-medium">Course content not available</p>
              <p className="text-sm">The course you're looking for doesn't exist or has no sections yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { course, progress } = data;
  const selectedSection = course.sections.find(s => s.id === selectedSectionId) || course.sections[0];
  const completedSections = course.sections.filter(s => s.is_completed).length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-20 space-y-6">
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {course.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {course.sections.length} sections • {completedSections} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5 bg-gray-50">
              <Clock className="w-3.5 h-3.5" />
              <span>Last accessed: Today</span>
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Progress value={progress} className="h-2.5 w-full max-w-md" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{progress}%</span>
            <span className="text-sm text-gray-500">completed</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main video/content area */}
        <div className="flex-1 space-y-4">
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedSection ? selectedSection.title : 'Course Content'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Section {course.sections.findIndex(s => s.id === selectedSection?.id) + 1} of {course.sections.length}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {selectedSection?.video_url ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-b-lg overflow-hidden">
                  <video
                    src={selectedSection.video_url}
                    controls
                    className="w-full h-full max-h-[500px] object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 p-6 rounded-b-lg">
                  <Video className="w-12 h-12 mb-3 opacity-70" />
                  <p className="font-medium">No video available for this section</p>
                  <p className="text-sm mt-1 text-gray-500">Check back later or contact admin team</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section details */}
          {selectedSection && (
            <div className="border border-gray-200 shadow-sm">
              <div className="p-4 pb-0">
                <h3 className="font-semibold text-gray-800">About this section</h3>
              </div>
              <div className="p-4 pt-2">
                <p className="text-sm text-gray-600">
                  {selectedSection.description || selectedSection.title}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with sections */}
        <div className="w-full lg:w-96 space-y-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Course Curriculum</h2>
                <Badge variant="secondary" className="px-2.5 py-1 text-xs bg-gray-100">
                  {completedSections}/{course.sections.length} completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
                {course.sections.map((section, index) => (
                  <button
                    key={section.id}
                    className={cn(
                      "w-full text-left transition-all duration-200",
                      "hover:bg-gray-50 active:bg-gray-100",
                      selectedSectionId === section.id ? "bg-blue-50" : ""
                    )}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full mt-0.5 shrink-0 transition-colors",
                        section.is_completed 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-500",
                        selectedSectionId === section.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
                      )}>
                        {section.is_completed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "text-sm font-medium text-left",
                          selectedSectionId === section.id ? "text-blue-600" : "text-gray-700"
                        )}>
                          {section.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {section.duration || 'N/A'}
                          </p>
                          {section.points > 0 && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {section.points} pts
                            </p>
                          )}
                        </div>
                      </div>
                      {section.is_completed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 px-2">
                          Done
                        </Badge>
                      ) : (
                        <CirclePlayIcon size={18} className="text-gray-400 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;