import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { Clock, Play, BookOpen, Award, Check, Globe, ChevronRight, BarChart2, HelpCircle, Shield, BadgeCheck, User, Calendar, Target, Download, ArrowBigDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoadUserQuery } from '@/features/api/authApi'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

// react player
import ReactPlayer from 'react-player/youtube'
// const paymentStatus = "completed";

const CourseDetails = () => {
    const { slug } = useParams()
    const { data, isLoading, error } = useLoadCourseQuery()
    const { data: user, isLoading: isLoadingUser, refetch } = useLoadUserQuery();
    const navigate = useNavigate();

    // Loading state
    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900 mx-auto"></div>
                <p className="text-gray-600">Loading course details...</p>
            </div>
        </div>
    )

    // Error state
    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-6 max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Failed to load course</h2>
                <p className="text-gray-600 mb-4">We couldn't load the course details. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        </div>
    )

    const course = data?.find(c => c.slug === slug)

    // Course not found state
    if (!course) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-6 max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Course Not Found</h2>
                <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or may have been removed.</p>
                <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
            </div>
        </div>
    )

    const handlepaywithkhalti = () => {
        if (user) {
            navigate(`/checkout/${course.slug}`)
        } else {
            navigate(`/login?redirect=/checkout/${course.slug}`)
        }
    }

    return (
        <div className="min-h-screen mt-14">

            <div className="bg-gray-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Course Info - 2 columns */}
                        <div className="lg:col-span-2">

                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-white text-gray-900 text-sm font-medium rounded-full">
                                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                </span>
                                {/* <div className="flex items-center text-yellow-400">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm">4.8 (2.3k)</span>
                                </div> */}
                                {/* <span className="text-sm text-gray-300 flex items-center">
                                    <Globe className="h-4 w-4 mr-2" />
                                    <span>{course.language}</span>
                                </span> */}
                                <span className="text-sm text-gray-300 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />

                                    <span>
                                        {new Date(course.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </span>
                            </div>


                            <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase">
                                {course.title}
                            </h1>


                            {/* <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                {course.description}
                            </p> */}


                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-2" />
                                    <span>{course.course_duration} hours</span>
                                </div>
                                <div className="flex items-center">
                                    <Globe className="h-5 w-5 mr-2" />
                                    {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
                                </div>



                            </div>


                        </div>
                        {/* Course thumbnail - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="relative rounded-lg overflow-hidden">
                                <img
                                    src={course.thumbnail || "/course1.png"}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
                                    <button
                                        onClick={() => window.open('https://youtu.be/TjCRfuIsOEE?si=zmZ0DbKROE5gg8Yh', '_blank')}
                                        className="bg-white rounded-full p-3 hover:scale-110 transition-transform"
                                    >
                                        <Play className="h-6 w-6 text-gray-900" />

                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                    <p className="text-white text-sm">Preview Course</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="border rounded-lg p-6">

                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <Award className="h-6 w-6 mr-3" />
                                Description
                            </h2>
                            <p className="text-sm text-gray-600"> {course.description}</p>


                        </div>

                        {/* Learning Outcomes */}
                        <div>
                            <div className="grid md:grid-cols-1 gap-6">
                                <div className="border rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-4">Requirements</h2>
                                    <ul className="space-y-2 text-gray-700">
                                        {course.requirements?.split('\n').map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <Check className="h-5 w-5 text-black mt-0.5 mr-2 flex-shrink-0" />
                                                <span>{req.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>


                            <div className="grid md:grid-cols-1 mt-4 gap-6">
                                <div className="border rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-4">Learning Outcomes</h2>

                                    <ul className="space-y-2 text-gray-700">
                                        {course.learning_outcomes?.split('\n').map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <Check className="h-5 w-5 text-black mt-0.5 mr-2 flex-shrink-0" />
                                                <span>{req.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>


                                </div>
                            </div>
                            <div className='grid md:grif-cols-1 mt-4 gap-6'>
                                <div className="border rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-6">Course Syllabus</h2>
                                    <ul className=" list-inside text-gray-700 space-y-2">

                                        {course.syllabus?.split('\n').map((line, index) => {
                                            const trimmed = line.trim();
                                            if (!trimmed) return null;

                                            return (

                                                <li key={index} className=" text-l font-bold">
                                                    {trimmed}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Right Sidebar - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">

                            <div className="border rounded-lg overflow-hidden">

                                <div className="p-6 border-b">
                                    <div className="text-center">

                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            रू{course.price}
                                            {course.original_price && (
                                                <span className="text-lg text-gray-500 line-through ml-2">
                                                    रू{course.original_price}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-green-600 font-medium">Limited time offer</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {!isLoadingUser ? (
                                        <Button
                                            onClick={handlepaywithkhalti}
                                            className="w-60 py-4 text-lg items-center justify-center font-semibold bg-black hover:bg-gray-950 text-white"
                                        >
                                            Buy Now

                                        </Button>
                                    ) : (
                                        <Button disabled className="w-full py-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Loading...
                                        </Button>
                                    )}

                                    <p className="text-center text-sm text-gray-500 mt-3">
                                        One time purchase, lifetime access
                                    </p>


                                    <div className="mt-4 p-3 rounded-lg text-center">
                                        <Button variant="outline">Add to Cart</Button>
                                    </div>

                                </div>

                                {/* <div className="p-6">
                                    {!isLoadingUser ? (
                                        paymentStatus === "completed" ? (
                                            <Button
                                                onClick={() => navigate("/my-learning")}
                                                className="w-60 py-4 text-lg items-center justify-center font-semibold bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Go to My Learning
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handlepaywithkhalti}
                                                className="w-60 py-4 text-lg items-center justify-center font-semibold bg-black hover:bg-gray-950 text-white"
                                            >
                                                Buy Now
                                            </Button>
                                        )
                                    ) : (
                                        <Button disabled className="w-full py-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Loading...
                                        </Button>
                                    )}

                                    <p className="text-center text-sm text-gray-500 mt-3">
                                        One-time purchase, lifetime access
                                    </p>

                                    {paymentStatus !== "completed" && (
                                        <div className="mt-4 p-3 rounded-lg text-center">
                                            <Button variant="outline">Add to Cart</Button>
                                        </div>
                                    )}
                                </div> */}


                            </div>
                            <div className="border rounded-lg p-6">
                                <h3 className="font-bold mb-4">This course includes:</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-500 mr-3" />
                                        <span className="text-sm">{course.course_duration} hours of lectures</span>

                                    </div>

                                    <div className="flex items-center">
                                        <BadgeCheck className="h-4 w-4 text-gray-500 mr-3" />
                                        <span className="text-sm">Certificate of completion</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetails