import React, { useState } from 'react';
import { useLoadCourseQuery } from '@/features/api/courseApi';
import Course from './Course';
import CourseSearch from './CourseSearch';

const AllCourse = ({course}) => {
  const [searchResults, setSearchResults] = useState(null);
  const { data, error, isLoading } = useLoadCourseQuery();
  const handleSearchResults = (results) => {
    setSearchResults(results);

  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-8">
       
       {/* Search Section */}
        <div className="mb-2">
          <CourseSearch onSearchResults={handleSearchResults} />
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            Failed to load courses
          </div>
        ) : data ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {searchResults ? 'Search Results' : 'All Courses'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {(searchResults || data).map(course => (
                <Course key={course.id} course={course} />
              ))}
            </div>

            {(searchResults?.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No courses found
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AllCourse;