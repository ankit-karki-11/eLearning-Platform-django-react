// components/CourseSearchResults.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CourseSearchResults = ({ results, loading, query, onResultClick }) => {
  const normalizedResults = () => {
    if (!results) return [];
    if (Array.isArray(results)) return results;
    if (Array.isArray(results.results)) return results.results;
    if (Array.isArray(results.data)) return results.data;
    return [];
  };

  const courses = normalizedResults();

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0 && query) {
    return (
      <div className="p-4 text-center text-gray-500">
        No courses found for "{query}"
      </div>
    );
  }

  return (
    <div className="p-2">
      {courses.slice(0, 5).map((course) => (
        <Link
          key={course.id}
          to={`/courses/course-detail/${course.slug}`}

          onClick={onResultClick}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        // className="block p-3 rounded-md hover:bg-gray-100 transition-colors"
        

        >
          <div className="font-medium text-sm">{course.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            {course.instructor?.name}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Rs{course.price}
          </div>
        </Link>
      ))}
      {courses.length > 5 && (
        <div className="p-3 text-center text-sm text-blue-600 border-t">
          <Link to={`/courses?search=${encodeURIComponent(query)}`} onClick={onResultClick}>
            View all {courses.length} results
          </Link>
        </div>
      )}
    </div>
  );
};

export default CourseSearchResults;