import React, { useState, useMemo } from 'react';
import { useLoadCourseQuery } from '@/features/api/courseApi';
import { useLoadCategoryQuery } from '@/features/api/categoryApi';
import Course from './Course';

const AllCourse = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Data
  const {
    data: coursesRaw,
    error: coursesError,
    isLoading: coursesLoading
  } = useLoadCourseQuery();

  const {
    data: categoriesRaw,
    error: catError,
    isLoading: catLoading
  } = useLoadCategoryQuery();

  // Normalize courses
  const courses = useMemo(() => {
    if (!coursesRaw) return [];
    if (Array.isArray(coursesRaw)) return coursesRaw;
    if (Array.isArray(coursesRaw.results)) return coursesRaw.results;
    if (Array.isArray(coursesRaw.data)) return coursesRaw.data;
    return [];
  }, [coursesRaw]);

  // Normalize categories
  // const categories = useMemo(() => {
  //   if (!categoriesRaw) return [];
  //   if (Array.isArray(categoriesRaw)) return categoriesRaw;
  //   if (Array.isArray(categoriesRaw.results)) return categoriesRaw.results;
  //   if (Array.isArray(categoriesRaw.data)) return categoriesRaw.data;
  //   return [];
  // }, [categoriesRaw]);

  // Normalize and sort categories
  const categories = useMemo(() => {
    if (!categoriesRaw) return [];
    let list = [];
    if (Array.isArray(categoriesRaw)) list = categoriesRaw;
    else if (Array.isArray(categoriesRaw.results)) list = categoriesRaw.results;
    else if (Array.isArray(categoriesRaw.data)) list = categoriesRaw.data;

    // Sort alphabetically by title (case-insensitive)
    return list
      .slice()
      .sort((a, b) =>
        (a.title || '').toLowerCase().localeCompare((b.title || '').toLowerCase())
      );
  }, [categoriesRaw]);

  // Filtered categories for search
  const visibleCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(cat =>
      (cat.title || '').toLowerCase().includes(categoryQuery.toLowerCase())
    );
  }, [categories, categoryQuery]);

  // Filter categories list by local query
  // const visibleCategories = useMemo(() => {
  //   if (!categoryQuery.trim()) return categories;
  //   const q = categoryQuery.toLowerCase();
  //   return categories.filter(c =>
  //     (c.title || '').toLowerCase().includes(q)
  //   );
  // }, [categories, categoryQuery]);

  // Courses after search, category filter, and sort
  const filteredCourses = useMemo(() => {
    let list = courses;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(course =>
        (course.title || '').toLowerCase().includes(query) ||
        (course.description || '').toLowerCase().includes(query) ||
        (course.instructor?.name || '').toLowerCase().includes(query)
      );
    }

    // Category filter (by slug)
    if (selectedCategory !== 'all') {
      list = list.filter(c => c.category && c.category.slug === selectedCategory);
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'price-desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
  }, [courses, searchQuery, selectedCategory, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The search is handled in the filteredCourses memo above
  };

  return (
    <div className="min-h-screen bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Catalog Title, Search and Sort in one row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Course Catalog</h1>
            <p className="text-gray-600 mt-1 text-sm">Discover our collection of courses</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center text-gray-700"
          >
            <span className="mr-2">Filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <div className="text-sm text-gray-500">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Mobile */}
          {mobileFiltersOpen && (
            <div className="lg:hidden bg-white p-4 rounded-lg border mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Categories */}
              {/* <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categoryQuery}
                    onChange={(e) => setCategoryQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCategory === 'all'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </button>
                  {visibleCategories
                    .slice() // Create a copy to avoid mutating the original array
                    .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                    .map(cat => (
                      <button
                        key={cat.id}
                        className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCategory === cat.slug
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={() => setSelectedCategory(cat.slug)}
                      >
                        {cat.title}
                      </button>
                    ))}
                </div>
              </div> */}
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categoryQuery}
                    onChange={(e) => setCategoryQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </button>
                  {visibleCategories.map(cat => (
                    <button
                      key={cat.id}
                      className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCategory === cat.slug
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {cat.title}
                    </button>
                  ))}

                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-800">Categories</h2>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categoryQuery}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {catLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : catError ? (
                <p className="text-red-500 text-sm">Failed to load categories</p>
              ) : (
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </button>
                  {visibleCategories.map(cat => (
                    <button
                      key={cat.id}
                      className={`w-full text-left px-3 py-2 text-sm rounded ${selectedCategory === cat.slug
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                {selectedCategory !== 'all' && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 mb-2">
                    {categories.find(c => c.slug === selectedCategory)?.title || selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg> */}
                    </button>
                  </div>
                )}
                <h2 className="text-xl font-medium text-gray-900">
                  {searchQuery ? 'Search Results' : 'All Courses'}
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </div>
            </div>

            {coursesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border overflow-hidden">
                    <div className="h-40 bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : coursesError ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-gray-700">Unable to load courses</h3>
                <p className="text-gray-500 text-sm mt-1">Please try again later</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg> */}
                </div>
                <h3 className="text-gray-700">No courses found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <Course key={course.id} course={course} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllCourse;