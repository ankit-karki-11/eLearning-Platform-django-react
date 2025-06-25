import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Course = ({ course, isEnrolled = false, isCompleted = false, progress = 0 }) => {
  const navigate = useNavigate();

  // Log props to debug
  console.log('Course props:', {
    courseSlug: course?.slug,
    title: course?.title,
    isEnrolled,
    isCompleted,
    progress,
  });

  const handleContinueLearning = () => {
    if (!course || !course.slug) {
      console.error('Invalid course data:', { course });
      alert('Cannot navigate to course. Course data is invalid.');
      return;
    }
    navigate(`/course/${course.slug}/progress`);
  };

  const handleViewDetails = () => {
    if (!course || !course.slug) {
      console.error('Invalid course data:', { course });
      alert('Cannot navigate to course details. Course data is invalid.');
      return;
    }
    navigate(`/course/course-detail/${course.slug}`);
  };

  if (isCompleted && progress !== 100) {
    console.warn(
      `Inconsistent state for course ${course?.slug || 'unknown'}: isCompleted is true but progress is ${progress}%`
    );
  }

  // Safeguard against missing course data
  if (!course) {
    console.error('Course prop is undefined');
    return <div className="text-red-600">Error: Invalid course data</div>;
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all w-full flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/default.png"}
          alt={course.title || 'Course'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium px-2 py-1 rounded-md">
            {course.level || 'Unknown'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <h3 className="font-semibold text-base line-clamp-2 dark:text-white">
          {course.title || 'Untitled Course'}
        </h3>
        {course.similarity_score !== undefined && (
          <p className="text-sm text-gray-500">
            Similarity: {(course.similarity_score * 100).toFixed(1)}%
          </p>
        )}
        {course.instructor && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By {course.instructor}
          </p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{course.course_duration || 0} hrs</span>
          </div>
          {course.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>{course.average_rating.toFixed(1)}/5</span>
            </div>
          )}
          {!isEnrolled && (
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              रु {course.price || 0}
            </span>
          )}
        </div>
        {isEnrolled && (
          <>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {progress}%
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mt-1">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Button
              size="sm"
              className={`w-full h-9 text-sm font-medium gap-1.5 cursor-pointer ${
                isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
              onClick={handleContinueLearning}
              // disabled={isCompleted} // Uncomment to disable for completed courses
            >
              {isCompleted ? 'Completed Course' : 'Continue Learning'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {!isEnrolled && (
        <div className="px-4 pb-4 mt-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="h-9 px-4 text-sm font-medium gap-1.5 bg-white border border-black text-black cursor-pointer"
            onClick={handleViewDetails}
            variant="outline"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Course;