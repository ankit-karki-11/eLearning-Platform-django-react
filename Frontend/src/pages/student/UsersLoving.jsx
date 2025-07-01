import React from 'react';
import { useLoadCoursesQuery } from '@/features/api/courseApi';  // Assuming this API hook exists
import { useNavigate } from 'react-router-dom';
import { User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UsersLoving = () => {
    const { data: courses, isLoading, error } = useLoadCoursesQuery();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Failed to load courses. Please try again later.</div>;

    // Filter courses with at least 4 students enrolled
    const popularCourses = courses.filter(course => course.total_enrolled >= 2);

    if (popularCourses.length === 0) {
        return <div>No popular courses found yet.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Courses Students Love ❤️</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCourses.map(course => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={course.thumbnail || '/default-course-thumbnail.png'}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="text-lg font-semibold mt-3">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.short_description || course.description?.substring(0, 100) + '...'}</p>

                        <div className="flex items-center text-sm text-gray-700 mt-2">
                            <User2 className="h-4 w-4 mr-1" />
                            {course.total_enrolled} Students Enrolled
                        </div>

                        <Button
                            onClick={() => navigate(`/course/${course.slug}`)}
                            className="mt-3 w-full bg-gray-900 text-white hover:bg-gray-800"
                        >
                            View Course
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersLoving;
