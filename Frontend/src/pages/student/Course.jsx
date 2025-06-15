import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShoppingCart, Star, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Course = ({ course, isEnrolled = false, progress = 0 }) => {
  const navigate = useNavigate();

  const handleContinueLearning = () => {
    navigate(`/course/${course.slug}/progress`);
  };

  const handleViewDetails = () => {
    navigate(`/course/course-detail/${course.slug}`);
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all w-full flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden group">

      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/default.png"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          
          <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium px-2 py-1 rounded-md">
            {/* {course.average_rating}/5 */}
            {course.level}

          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* Kept the original title style as requested */}
        <h3 className="font-semibold text-base line-clamp-2 dark:text-white">
          {course.title}
        </h3>
        {course.similarity_score !== undefined && (
          <p className="text-sm text-gray-500">
            Similarity: {(course.similarity_score * 100).toFixed(1)}%
          </p>
        )}
        {/* Instructor and Rating - New addition but subtle */}
        {course.instructor && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By {course.instructor}
          </p>
        )}

        {/* Course Metadata */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{course.course_duration} hrs</span>
          </div>

          {/* average_rating */}
          {course.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>{course.average_rating.toFixed(1)}/5</span>
            </div>
          )}

          {!isEnrolled && (
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              रु {course.price}
            </span>
          )}
        </div>

        {/* Progress for enrolled students */}
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
              className="w-full h-9 text-sm font-medium gap-1.5 bg-gray-600 hover:bg-gray-700"
              onClick={handleContinueLearning}
            >
              Continue Learning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Actions for non-enrolled students */}
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
            className="h-9 px-4 text-sm font-medium gap-1.5"
            onClick={handleViewDetails}
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