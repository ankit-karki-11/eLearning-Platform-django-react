import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Play, CheckCircle, BookOpen } from "lucide-react";
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
      onClick={!isEnrolled ? handleViewDetails : undefined}
      className="max-w-6xl mx-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer
      transition-all duration-300 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 group"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={course.thumbnail || "/default.png"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
          {course.level || 'All Levels'}
        </div>
        
        {/* Enrolled Badge */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 text-xs px-2.5 py-1 rounded-full font-medium flex items-center shadow-sm">
            <BookOpen className="h-3 w-3 mr-1 text-blue-600" />
            <span className="text-gray-700 dark:text-gray-300">Enrolled</span>
          </div>
        )}
        
        {/* Progress bar overlay for enrolled courses */}
        {isEnrolled && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <Progress value={progress} className="h-1.5 bg-white/30" />
          </div>
        )}
        
        {/* Completed Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        )}
        
        {/* Play button overlay for non-enrolled */}
        {!isEnrolled && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <Play className="h-5 w-5 text-red-500 fill-red-500" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-small text-gray-900 dark:text-gray-100 line-clamp-2 flex-1 leading-tight">
            {course.title || 'Untitled Course'}
          </h3>
        </div>
        
        {course.similarity_score !== undefined && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5 inline-block">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {(course.similarity_score * 100).toFixed(1)}% match
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-3 text-l text-gray-900 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.course_duration || 0}h</span>
          </div>
          
          {course.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span>{course.average_rating.toFixed(1)}</span>
            </div>
          )} 

          {!isEnrolled && (
            <span className="text-sm font-semibold text-black dark:text-white whitespace-nowrap ml-auto">
              Rs {course.price || 0}
            </span>
          )}
        </div>

        {isEnrolled && (
          <div className="pt-1 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{progress}%</span>
            </div>
            <Button
              size="sm"
              className={`w-full h-8 text-xs font-medium ${isCompleted ? 
                'bg-gray-900 hover:bg-gray-800 text-white' : 
                'bg-black hover:bg-gray-800 text-white'
              }`}
              onClick={handleContinueLearning}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Continue
                </>
              )}
            </Button>
          </div>
        )}
        
        {!isEnrolled && (
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white text-xs h-8 cursor-pointer"
            onClick={handleViewDetails}
          >
            View Course
          </Button>
        )}
      </div>
    </div>
  );
};

export default Course;