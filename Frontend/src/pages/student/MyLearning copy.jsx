import React from 'react'
import Course from './Course';
import { useLoadMyEnrollmentsQuery } from '@/features/api/enrollmentApi';

const MyLearning = () => {
    const { data: enrollments, isLoading } = useLoadMyEnrollmentsQuery();

    return (
        <div className='max-w-4xl m-auto my-24 px-4 md:px-0'>
            <h1 className='font-bold text-2xl mb-5'>My Learning</h1>

            {isLoading ? (
                <MyLearningSkeleton />
            ) : enrollments?.length === 0 ? (
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                        You haven't enrolled in any courses yet.
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {enrollments?.map((enrollment) => (
                        <Course
                            key={enrollment.course.slug}
                            course={enrollment.course}
                            isEnrolled={true}
                            isCompleted={enrollment.status === 'completed' || enrollment.status === 'certified'}
                           
                            progress={
                                enrollment.progress % 1 === 0
                                    ? `${enrollment.progress.toFixed(0)}`
                                    : `${enrollment.progress.toFixed(2)}`
                            }

                        

                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Skeleton loader remains the same
const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);

export default MyLearning;