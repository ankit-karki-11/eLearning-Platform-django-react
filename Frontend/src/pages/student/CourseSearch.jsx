import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchCoursesQuery } from '@/features/api/courseApi';
import Course from './Course';
import { Search } from 'lucide-react';

const DEBOUNCE_DELAY = 500; // ms

const CourseSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const [query, setQuery] = useState(queryParam);
    const [debouncedQuery, setDebouncedQuery] = useState(queryParam);

    // Update debouncedQuery only after user stops typing for DEBOUNCE_DELAY ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [query]);

    // Update URL params when debouncedQuery changes
    useEffect(() => {
        if (debouncedQuery) {
            setSearchParams({ q: debouncedQuery });
        } else {
            setSearchParams({});
        }
    }, [debouncedQuery, setSearchParams]);

    const { data: results = [], isFetching, isError } = useSearchCoursesQuery(
        { q: debouncedQuery },
        { skip: !debouncedQuery }
    );

    useEffect(() => {
        setQuery(queryParam);
    }, [queryParam]);

    return (
        <div className="max-w-6xl mx-auto px-1 py-2 mt-8">
            {/* Search Section */}
            <div className="mb-12">
                <div className="max-w-2xl mx-auto">
                     <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search course by title or keywords..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                />
            </div>
                </div>
            </div>

            {/* Status Messages */}
            <div className="mb-8">
                {isFetching && (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            
                            Searching...
                        </div>
                    </div>
                )}
                
                {!isFetching && results.length > 0 && debouncedQuery && (
                    <div className="text-center text-gray-600 text-sm">
                        {results.length} course{results.length > 1 ? 's' : ''} found
                    </div>
                )}
                
                {isError && (
                    <div className="text-center text-red-500 text-sm">
                        Something went wrong. Please try again.
                    </div>
                )}
                
                {!isFetching && results.length === 0 && debouncedQuery && (
                    <div className="text-center text-gray-500 text-sm">
                        No courses found for "{debouncedQuery}".Explore All Courses below.
                    </div>
                )}
            </div>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {results.map((course) => (
                    <Course key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CourseSearch;