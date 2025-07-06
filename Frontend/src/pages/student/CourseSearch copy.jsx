import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchCoursesQuery } from '@/features/api/courseApi';
import Course from './Course';

const CourseSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);

  const { data: results = [], isFetching, isError } = useSearchCoursesQuery(
    { q: queryParam },
    { skip: !queryParam }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Update URL query parameter — this triggers the component to re-render and refetch
      setSearchParams({ q: query.trim() });
    } else {
      // Clear query param if input empty
      setSearchParams({});
    }
  };

  // Keep input value synced if user navigates or reloads with query param
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-12">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search courses by title or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </form>

      {isFetching && <p className="text-gray-600">Searching...</p>}
      <p className="text-gray-500">results found for “{queryParam}”</p>
      {isError && <p className="text-red-600">Something went wrong. Try again.</p>}
      {!isFetching && results.length === 0 && queryParam && (
        <p className="text-gray-500">No results found for “{queryParam}”</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((course) => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseSearch;
