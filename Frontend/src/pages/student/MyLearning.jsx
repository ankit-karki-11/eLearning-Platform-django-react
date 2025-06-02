import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';
import { useLoadCourseQuery } from '@/features/api/courseApi';
import { User } from 'lucide-react';
import { useLoadMyEnrollmentsQuery } from '@/features/api/enrollmentApi';

const MyLearning = () => {
    const {data:LoadUserData,isLoading:IsUserLoading} = useLoadUserQuery();
    const {data, isLoading }= useLoadMyEnrollmentsQuery();
    // const isLoading = false;
    const myLearningCourses = data || [];
    // const myLearningCourses =data?.student.Course|| [];
    return (
        <div className='max-w-4xl m-auto my-24 px-4 md:px-0'>
            <h1 className='font-bold text-2xl'> My Learning 
                <div className='my-5'>
                    {
                        isLoading ? (<MyLearningSkeleton />

                        ) : myLearningCourses.length === 0 ?
                            (<p>You aren't enrolled in any course</p>) :
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                           {
                             myLearningCourses.map((enrollment,index)=> (
                                   <Course key={index} course={enrollment.course} />
                        ))}
                            </div>
                    }
                </div>
            </h1>
        </div>
    )
}
export default MyLearning

// Skeleton for loading 
const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);