import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchCoursesQuery } from '@/features/api/courseApi';
import Course from './Course';
import { Search, X } from 'lucide-react';

const DEBOUNCE_DELAY = 300; // Reduced for better responsiveness

const CourseSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const [query, setQuery] = useState(queryParam);
    const [debouncedQuery, setDebouncedQuery] = useState(queryParam);
    const [showResults, setShowResults] = useState(false);

    // Update debouncedQuery only after user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query.trim());
            if (query.trim()) {
                setShowResults(true);
            }
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [query]);

    // Update URL params when debouncedQuery changes
    useEffect(() => {
        if (debouncedQuery) {
            setSearchParams({ q: debouncedQuery });
        } else {
            setSearchParams({});
            setShowResults(false);
        }
    }, [debouncedQuery, setSearchParams]);

    const { data: results = [], isFetching, isError } = useSearchCoursesQuery(
        { q: debouncedQuery },
        { skip: !debouncedQuery || debouncedQuery.length < 2 }
    );

    // Reset query when URL param changes
    useEffect(() => {
        setQuery(queryParam);
        if (queryParam) {
            setShowResults(true);
        }
    }, [queryParam]);

    const handleClear = () => {
        setQuery('');
        setShowResults(false);
        setSearchParams({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            setDebouncedQuery(query.trim());
            setShowResults(true);
        }
    };
    useEffect(() => {
        setQuery(queryParam);
    }, [queryParam]);


    return (
        <div className="max-w-6xl mx-auto px-1 py-4 mt-6">
            {/* Search Section */}
            <div className="mb-2 flex justify-end">
                <div className="max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-4" />
                            <input
                                type="text"
                                placeholder="Search courses by title or keywords..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-10 py-2 text-base bg-white border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-sm"
                                autoComplete="off"

                            />
                            {query && (
                                <button
                                    aria-label="Clear search"
                                    onClick={() => setQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-gray-900"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            {showResults && debouncedQuery && debouncedQuery.length >= 2 && (
                <div className="mb-8">
                    {/* Status Messages */}
                    {isFetching && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center gap-2 text-gray-500">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                Searching courses...
                            </div>
                        </div>
                    )}

                    {!isFetching && !isError && results.length > 0 && (
                        <div className="mb-6">
                            <div className="text-center text-gray-600 mb-6">
                                <span className="font-medium">{results.length}</span> course{results.length !== 1 ? 's' : ''} found for "{debouncedQuery}"
                            </div>

                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {results.map((course) => (
                                    <Course key={course.id} course={course} />
                                ))}
                            </div>
                        </div>
                    )}

                    {!isFetching && !isError && results.length === 0 && (
                        <div className="text-center">
                            <div className="text-gray-500 mb-2">
                                {/* <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" /> */}
                                {/* <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3> */}
                                <p className="text-gray-500">
                                    No courses match "{debouncedQuery}". Try different keywords.
                                </p>
                            </div>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-12">
                            <div className="text-red-500">
                                <div className="text-lg font-medium mb-2">Something went wrong</div>
                                <p className="text-gray-500">Please try again later</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Show all courses when no search */}
            {/* {!showResults && (
                <div className="text-center py-12">
                    <div className="text-gray-500">
                        <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Search for courses</h3>
                        <p className="text-gray-500">Enter keywords to find relevant courses</p>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default CourseSearch;