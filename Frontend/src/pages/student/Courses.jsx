import { useLoadCourseQuery } from '@/features/api/courseApi'
import Course from './Course'
import { Skeleton } from '@/components/ui/skeleton'

const Courses = () => {
  const { data, error, isLoading } = useLoadCourseQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return <p>Error loading courses</p>
  }

  return (
    <div className="bg-gray-250">
      <div className="max-w-6xl mx-auto p-14">
        <h2 className="font-bold text-3xl text-left mb-8">Courses We Offered.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {data?.map((course) => (
            <Course key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Courses

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}
    