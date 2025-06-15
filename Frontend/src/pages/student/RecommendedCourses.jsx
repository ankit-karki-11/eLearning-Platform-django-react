import React from 'react';
import { useGetRecommendedCoursesQuery } from '@/features/api/recommendationApi';
import Course from './Course';
import { Skeleton } from '@/components/ui/skeleton';

const RecommendedCourses = ({ courseSlug }) => {
  const { data: courses, isLoading, error } = useGetRecommendedCoursesQuery(courseSlug);
  console.log("Recommended courses:", courses);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[...Array(3)].map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    );  
  }

  if (error || !courses || courses.length === 0) {
    console.log("No similar courses found")
    return <p>No similar courses found</p>;
    
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Course key={course.id} course={course} />
          
        ))}
        
      </div>
    </div>
  );
};

export default RecommendedCourses;

const CourseSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
    <Skeleton className="w-full h-36" />
    <div className="px-5 py-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);
