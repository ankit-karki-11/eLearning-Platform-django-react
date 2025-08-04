import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Course = ({ course, isEnrolled = false, isCompleted = false, progress = 0 }) => {
  const navigate = useNavigate();

  const handleContinueLearning = (e) => {
    e.stopPropagation();
    navigate(`/course/${course.slug}/progress`);
  };

  const handleViewDetails = () => {
    navigate(`/courses/course-detail/${course.slug}`);
  };

  if (!course) return <div className="text-red-500 text-sm p-3">Invalid course data</div>;

  return (
    <div
      onClick={!isEnrolled ? handleViewDetails : handleContinueLearning}
      className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden w-full cursor-pointer
      transition-all duration-200 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 group"
    >
      <div className="aspect-video relative">
        <img
          src={course.thumbnail || "/default.png"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 text-xs px-2 py-1 rounded font-medium">
          {course.level || 'All Levels'}
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-sm line-clamp-2 dark:text-gray-100 flex-1">
            {course.title || 'Untitled Course'}
          </h3>
          
        </div>
        {course.similarity_score !== undefined && (
          <p className="text-sm text-gray-500">
            Similarity: {(course.similarity_score * 100).toFixed(1)}%
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.course_duration || 0} hrs</span>
          </div>
          
          {course.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span>{course.average_rating.toFixed(1)}</span>
            </div>
          )} 

            {!isEnrolled && (
            <span className="text-xs font-bold text-black dark:text-blue-400 whitespace-nowrap">
              Rs {course.price || 0}
            </span>
          )}
        </div>

        {isEnrolled && (
          <div className="pt-1 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium">Progress</span>
              <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
            <Button
              size="sm"
              className={`w-full h-7 text-xs font-medium ${isCompleted ? 
                'bg-gray-900 hover:bg-gray-950 text-white' : 
                'bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
              onClick={handleContinueLearning}
            >
              {/* <Play className="h-3 w-3 mr-1.5" /> */}
              {isCompleted ? 'Completed' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;