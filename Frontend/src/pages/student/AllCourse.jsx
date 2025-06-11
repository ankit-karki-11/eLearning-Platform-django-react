import { useLoadCourseQuery } from '@/features/api/courseApi';
import Course from './Course'; // This is your existing card
import { Skeleton } from '@/components/ui/skeleton';
import { FileSearch, Search, SearchX } from 'lucide-react';

const AllCourse = () => {
  const { data, error, isLoading } = useLoadCourseQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">Failed to load courses.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 mt-12">All Courses</h1>
      <Search className="w-6 h-6 text-gray-500 mb-4" />
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((course) => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
export default AllCourse
