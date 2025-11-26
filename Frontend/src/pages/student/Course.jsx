import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, CheckCircle, BookOpen, PlayCircleIcon } from "lucide-react";
import { useLoadMyEnrollmentsQuery } from "@/features/api/enrollmentApi";

const Course = ({ course }) => {
  const navigate = useNavigate();
  const { data: enrollments } = useLoadMyEnrollmentsQuery();

  if (!course) return <div className="text-red-500 p-2 text-sm">Invalid course data</div>;

  const enrollment = enrollments?.find(e => e.course.slug === course.slug);
  const isEnrolled = !!enrollment;
  const isInProgress = enrollment?.status === "in-progress";
  const isCompleted = enrollment?.status === "completed";
  const isCertified = enrollment?.status === "certified";
  const progress = enrollment?.progress?.toFixed(0) || 0;

  const handleClick = () => {
    if (isEnrolled) {
      // navigate(`/course/${course.slug}/progress`);
       navigate(`/courses/course-detail/${course.slug}`);
    } else {
      navigate(`/courses/course-detail/${course.slug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="max-w-8xl mx-auto dark:bg-gray-900 border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition p-2"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded">
        <img
          src={course.thumbnail || "/default.png"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-gray-800 dark:bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center">
          {/* <BookOpen className="h-3 w-3 mr-1 text-blue-600" /> */}
          {course.level}
        </div>
        {isEnrolled && (
          <div
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded flex items-center
      ${enrollment?.status === "in-progress"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : enrollment?.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : enrollment?.status === "certified"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }
    `}
          >
            <BookOpen
              className={`h-3 w-3 mr-1 ${enrollment?.status === "in-progress"
                  ? "text-blue-600"
                  : enrollment?.status === "completed"
                    ? "text-green-600"
                    : enrollment?.status === "certified"
                      ? "text-purple-600"
                      : "text-gray-600"
                }`}
            />
            {enrollment?.status === "in-progress"
              ? "In Progress"
              : enrollment?.status === "completed"
                ? "Completed"
                : enrollment?.status === "certified"
                  ? "Certified"
                  : "Enrolled"}
          </div>
        )}

      </div>

      {/* Info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-   text-gray-900 dark:text-gray-100 line-clamp-2">
          {course.title}
        </h3>

        {course.similarity_score !== undefined && (
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-2.5 py-1.5 inline-block">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {(course.similarity_score * 100).toFixed(1)}% match
            </p>
          </div>
        )}
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 gap-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.course_duration || 0}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span>{course.average_rating?.toFixed(1) || "0.0"}</span>
          </div>  
          <span className="ml-auto font-medium">Rs {course.price || XX}</span>
        </div>

        {/* Progress / Action */}
        {/* Show Start Course if enrolled */}
        {isEnrolled && !isCompleted && !isCertified && (
          <div className="mt-2 space-y-1">
            <Progress value={progress} className="h-1.5 bg-gray-200 dark:bg-gray-700" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Start Course
            </p>
          </div>
        )}

        {/* Show Leave Review if completed or certified */}
        {/* {(isCompleted || isCertified) && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Leave Review
            </p>
          </div>
        )} */}

      </div>
    </div>
  );
};

export default Course;
