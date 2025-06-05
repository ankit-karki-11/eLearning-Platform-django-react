import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  CheckCircle2, CirclePlayIcon, MarsStroke, Video } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom'

const CourseProgress = () => {
    const { slug } = useParams();
    const isCompleted = true;

    return (
        <div className='max-w-7xl mx-auto p-4 mt-24'>
            {/* display course name */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Course Title</h1>
                <Button>
                    Completed
                </Button>
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
                {/* video section div */}
                <div className='flex-1 md:w-3/5 g-fit rounded-lg shadow-lg p-4'>
                    <div>
                        {/* video here */}
                        <Video className='w-10 h-10'></Video>
                        {/* <video src=""></video> */}

                    </div>
                    {/* display currrent watching lecture title */}
                    <div className='mt-2'>
                        <h3 className='text-lg font-bold'>Current Lecture: Introdection</h3>

                    </div>
                </div>
                {/* sidebar of section or lecture */}
                <div className='flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l md-pl-4 pt-4 md-pt-4 border-gray-300'>
                    <h2 className='font-semibold text-xl mb-4'>Course Sidebar sections</h2>

                    <div className='flex-1 overflow-auto'>
                        {
                            [1, 2, 3, 4].map((lecture, index) => (
                                <Card key={index} className='mb-2 hover:cursor-pointer transition transform'>
                                    <CardContent className='flex items-cente justify-between p-4'>
                                        <div className='flex items-center gap-2'>
                                            {
                                                isCompleted ? (
                                                    <CheckCircle2 size={24} className='text-green-500 mr-2' />
                                                ) : (
                                                    <CirclePlayIcon size={24} className='text-gray-500 mr-2' />
                                                )
                                            }
                                            <div>
                                                <CardTitle text-lg font-medium>
                                                    Inrroduction
                                                </CardTitle>

                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-green-600 border-green-600"
                                        >
                                            Completed
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))
                        }

                    </div>
                </div>


            </div>

        </div>
    )
}

export default CourseProgress 
