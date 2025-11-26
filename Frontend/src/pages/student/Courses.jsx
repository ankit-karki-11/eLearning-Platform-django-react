import { useLoadCourseQuery } from '@/features/api/courseApi';
import Course from './Course';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';

const Courses = () => {
  const { data, error, isLoading } = useLoadCourseQuery({ is_published: true });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">Error loading courses</p>;
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-3xl text-left mb-8">Courses We Offered</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {data?.slice(0, 8).map((course) => (
            <Course key={course.id} course={course} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            onClick={() => window.location.href = '/courses'}
            className="px-4 py-3 text-sm font-medium border border-black cursor-pointer flex items-center gap-2"
            variant="outline"
          >
            Browse All Courses
            <ArrowRightCircle className="h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-xs mx-auto">
      <Skeleton className="w-full h-40" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
