import React, { useState } from 'react';
import Course from './Course';
import { useLoadMyEnrollmentsQuery } from '@/features/api/enrollmentApi';
import { BookOpen, Clock, Award, Filter } from 'lucide-react';

const MyLearning = () => {
    
    const { data: enrollments, isLoading } = useLoadMyEnrollmentsQuery();
    const [filter, setFilter] = useState('all'); // 'all', 'in-progress', 'completed'

    // Calculate stats
    const totalCourses = enrollments?.length || 0;
    const completedCourses = enrollments?.filter(e => 
        e.status === 'completed' || e.status === 'certified'
    ).length || 0;
    const inProgressCourses = totalCourses - completedCourses;

    // Filter courses
    const filteredEnrollments = enrollments?.filter(enrollment => {
        if (filter === 'all') return true;
        if (filter === 'completed') {
            return enrollment.status === 'completed' || enrollment.status === 'certified';
        }
        return enrollment.status !== 'completed' && enrollment.status !== 'certified';
    });

    return (
        <div className='min-h-screen bg-white py-8 mt-12'>
             {/* <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full'> */}
               
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2'>
                     
                        My Learning
                    </h1>
                    <p className='text-gray-600'>Your enrolled courses and progress</p>
                </div>

                {/* Stats */}
                {!isLoading && enrollments && enrollments.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                        <div className='bg-white p-4 rounded-lg border shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-blue-100 rounded-full'>
                                    <BookOpen size={18} className='text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Total Courses</p>
                                    <p className='text-xl font-semibold'>{totalCourses}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='bg-white p-4 rounded-lg border shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-blue-100 rounded-full'>
                                    <Clock size={18} className='text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>In Progress</p>
                                    <p className='text-xl font-semibold text-blue-600'>{inProgressCourses}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='bg-white p-4 rounded-lg border shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-green-100 rounded-full'>
                                    <Award size={18} className='text-green-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Completed</p>
                                    <p className='text-xl font-semibold text-green-600'>{completedCourses}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Section */}
                {!isLoading && enrollments && enrollments.length > 0 && (
                    <div className='mb-6 bg-white p-4 rounded-lg'>
                        <div className='flex items-center gap-2 mb-3'>
                            {/* <Filter size={18} className='text-gray-500' /> */}
                            <span className='text-sm font-medium text-gray-700'>Filter by:</span>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                                    filter === 'all' 
                                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <BookOpen size={16} />
                                All Courses
                            </button>
                            <button 
                                onClick={() => setFilter('in-progress')}
                                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                                    filter === 'in-progress' 
                                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Clock size={16} />
                                In Progress
                            </button>
                            <button 
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                                    filter === 'completed' 
                                        ? 'bg-green-100 text-green-700 border border-green-300' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Award size={16} />
                                Completed
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
                                <div className="h-40 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredEnrollments && filteredEnrollments.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-lg border shadow-sm text-center">
                        {/* <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <BookOpen size={32} className='text-gray-400' />
                        </div> */}
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {filter !== 'all' ? `No ${filter.replace('-', ' ')} courses` : 'No courses yet'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {filter !== 'all' 
                                ? `You don't have any ${filter.replace('-', ' ')} courses.` 
                                : 'You haven\'t enrolled in any courses yet.'
                            }
                        </p>
                        <button 
                            onClick={() => filter !== 'all' ? setFilter('all') : window.location.href = '/courses'}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-950 text-sm flex items-center gap-2 mx-auto"
                        >
                            {/* <BookOpen size={16} /> */}
                            {filter !== 'all' ? 'View All Courses' : 'Browse Courses'}
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {filteredEnrollments?.map((enrollment) => (
                            <Course
                                key={enrollment.course.slug}
                                course={enrollment.course}
                                isEnrolled={true}
                                isCompleted={enrollment.status === 'completed' || enrollment.status === 'certified'}
                                progress={enrollment.progress.toFixed(0)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;