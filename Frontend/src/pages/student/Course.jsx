import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Course = ({ course, isEnrolled = false, isCompleted = false, progress = 0 }) => {
  const navigate = useNavigate();

  const handleContinueLearning = (e) => {
    e.stopPropagation();
    if (!course?.slug) return;
    navigate(`/course/${course.slug}/progress`);
  };

  const handleViewDetails = () => {
    if (!course?.slug) return;
    navigate(`/course/course-detail/${course.slug}`);
  };

  if (!course) return <div className="text-red-600 p-4">Error: Invalid course data</div>;

  return (
    <div 
    
      onClick={!isEnrolled ? handleViewDetails : handleContinueLearning}
      className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden w-full cursor-pointer
      transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 group"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={course.thumbnail || "/default.png"}
          alt={course.title || 'Course'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded font-small">
          {course.level || 'All Levels'}
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      </div>
      
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 dark:text-white">
          {course.title || 'Untitled Course'}
        </h3>
          {course.similarity_score !== undefined && (
          <p className="text-sm text-gray-500">
            Similarity: {(course.similarity_score * 100).toFixed(1)}%
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full font-medium">
            <Clock className="h-3 w-3 text-gray-900 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-gray-300">{course.course_duration || 0}hrs</span>
          </div>
          
          {course.average_rating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full font-medium">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-gray-900 dark:text-gray-300">{course.average_rating.toFixed(1)}</span>
            </div>
          )}
          
          {!isEnrolled && (
            <div className=" px-2 py-1 rounded-full font-medium">
              <span className="text-gray-900 font-small dark:text-blue-400">Rs {course.price || 0}</span>
            </div>
          )}
        </div>
        
        {isEnrolled && (
          <div className="pt-1">
            <div className="text-xs mb-1 font-medium">Progress: {progress}%</div>
            <Progress value={progress} className="h-2" />
            <Button
              size="sm"
              className={`w-full mt-2 h-8 text-xs font-medium cursor-pointer ${
                isCompleted ? 'bg-black hover:bg-gray-950 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
              onClick={handleContinueLearning}
            >
              {isCompleted ? 'Completed' : 'Continue Learning'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;

