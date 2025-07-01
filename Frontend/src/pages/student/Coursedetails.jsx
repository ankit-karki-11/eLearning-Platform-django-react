import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { Clock, Play, BookOpen, Award, Check, Globe, ChevronRight, BarChart2, HelpCircle, Shield, BadgeCheck, User, Calendar, Target, Download, ArrowBigDown, CheckCircle, Tent, CheckLine, CheckSquare2, ShieldAlert, BadgeInfo, Badge, User2, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoadUserQuery } from '@/features/api/authApi'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import ReactPlayer from 'react-player/youtube'
import RecommendedCourses from './RecommendedCourses'
import { useLoadMyEnrollmentsQuery } from '@/features/api/enrollmentApi';

const CourseDetails = () => {
    const { slug } = useParams()
    const { data, isLoading, error } = useLoadCourseQuery()
    const { data: user, isLoading: isLoadingUser, refetch } = useLoadUserQuery();
    const { data: enrollments, } = useLoadMyEnrollmentsQuery();
    const isEnrolled = enrollments?.is_enrolled;

    const navigate = useNavigate();

    // Loading state
    if (isLoading) return (
        <LoadingSkeleton />
    )


    // Error state
    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Failed to load course</h2>
                <p className="text-gray-600 mb-4">We couldn't load the course details. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        </div>
    )

    const course = data?.find(c => c.slug === slug)
    // const isEnrolled = enrollments?.is_enrolled ?? false;

    // Course not found state
    if (!course) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Course Not Found</h2>
                <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or may have been removed.</p>
                <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
            </div>
        </div>
    )


    const handleIsEnrolled = () => {
        if (user) {
            navigate(`/course/${course.slug}/progress`);
        } else {
            navigate(`/login?redirect=/checkout/${course.slug}`)
        }
    }
    // )

    const handlePayWithKhalti = () => {
        if (user) {
            navigate(`/checkout/${course.slug}`)
        } else {
            navigate(`/login?redirect=/checkout/${course.slug}`)
        }
    }

    return (
        <div className="min-h-screen mt-8 bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-950 to-black text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Course Info */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 bg-white text-gray-900 text-xs font-small rounded-full">
                                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                </span>
                                <span className="text-xs text-gray-300 flex items-center">
                                    <Calendar className="h-2 w-2 mr-1" />
                                    <span> Last Updated on:
                                        {new Date(course.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </span>

                                {/* <span className="text-xs text-gray-300 flex items-center">
                                    Total Students Enrolled:20
                                </span> */}

                            </div>

                            <h1 className="text-3xl md:text-3xl lg:text-3xl font-bold leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-sm text-gray-300 max-w-3xl">
                                {course.short_description || course.description.substring(0, 200) + '...'}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-2xl text-xs">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>{course.course_duration} hours</span>
                                </div>
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg text-xs">
                                    <Languages className="h-4 w-4 mr-2" />
                                    {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
                                </div>
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg text-xs">
                                    <User2 className="h-4 w-4 mr-2" />
                                    <span>Students Enrolled: {course.total_enrolled}</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Thumbnail */}
                        <div className="lg:col-span-1">
                            <div className="relative overflow-hidden shadow-2xl hover:shadow-primary">
                                <img
                                    src={course.thumbnail || "/course1.png"}
                                    alt={course.title}
                                    className="w-full h-full object-cover cursor-pointer"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={() => window.open('https://youtu.be/TjCRfuIsOEE?si=zmZ0DbKROE5gg8Yh', '_blank')}
                                        className="bg-blue-700 rounded-full p-4 hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <Play className="h-6 w-6 text-gray-200 fill-current cursor-pointer" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                    <p className="text-white text-sm font-small">Preview this course</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Pricing - Fixed at top after scroll */}
            <div className="lg:hidden sticky top-0 z-10 bg-white border-b py-3 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-lg font-bold">रू{course.price}</div>
                            {course.original_price && (
                                <div className="text-xs text-gray-500 line-through">
                                    रू{course.original_price}
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={handlePayWithKhalti}
                            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-sm"
                        >
                            Enroll Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Description Card */}
                        <div className="bg-white border-1 border-gray-300 rounded p-4 md:p-4">
                            <h2 className="text-xl font-bold mb-2 flex items-center">
                                {/* <Award className="h-6 w-6 mr-3 text-blue-600" /> */}
                                Description
                            </h2>
                            <div className="prose max-w-none text-shadow-black ">
                                <p className="text-sm leading-relaxed">{course.description}</p>
                            </div>
                        </div>


                        <div className="space-y-6">
                            <div className="bg-white border-1 border-gray-300 rounded p-4 md:p-4">
                                <h2 className="text-xl font-bold mb-6">What you'll learn</h2>
                                <div className="grid md:grid-cols-1 gap-2 text-sm">
                                    {course.learning_outcomes?.split('\n').filter(Boolean).map((outcome, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                            <span className="text-shadow-black">{outcome.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-4">
                                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                                <div className="grid md:grid-cols-1 gap-2 text-sm">
                                    {course.requirements?.split('\n').filter(Boolean).map((req, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                            <span className="text-gray-800">{req.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Syllabus */}
                        <div className="bg-white border-1 border-gray-300 rounded p-4 md:p-4">
                            <h2 className="text-xl font-bold mb-4">Course Content</h2>
                            <div className="grid md:grid-cols-1 gap-2 text-sm">
                                {course.syllabus?.split('\n').filter(Boolean).map((line, index) => (
                                    <div key={index} className="flex items-start">
                                        <CheckSquare2 className="h-4 w-4 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                        {/* <h3 className="text-sm  text-gray-800">{line.trim()}</h3> */}
                                        <span className="text-gray-800">{line.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Syllabus */}
                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                            <ol className="list-decimal list-inside space-y-2">
                                {course.syllabus?.split('\n').filter(Boolean).map((line, index) => (
                                    <li key={index} className="text-lg  text-gray-800">
                                        {line.trim()}
                                    </li>
                                ))}
                            </ol>
                        </div> */}

                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Pricing Card */}
                            <div className="bg-white border-1 border-gray-300 rounded overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            Rs {course.price}
                                            {course.original_price && (
                                                <span className="text-lg text-gray-500 line-through ml-2">
                                                    Rs{course.original_price}
                                                </span>
                                            )}
                                        </div>
                                        {course.original_price && (
                                            <p className="text-sm text-green-600 font-medium">
                                                {Math.round((1 - course.price / course.original_price) * 100)}% discount
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 space-y-2">
                                    {!isLoadingUser ? (
                                        <Button
                                            onClick={isEnrolled ? handleIsEnrolled : handlePayWithKhalti}
                                            className="w-full py-6 text-m  bg-gray-900 hover:bg-gray-950 text-white cursor-pointer"
                                        >
                                            {isEnrolled ? 'Continue Course' : 'Buy Course'}
                                        </Button>
                                    ) : (
                                        <Button disabled className="w-full py-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Loading...
                                        </Button>
                                    )}

                                    <p className="text-center text-sm text-gray-700">
                                        One-time payment,Lifetime access
                                    </p>

                                    {/* <div className="pt-2">
                                        <Button variant="outline" className="w-full py-6 text-lg">
                                            Add to Cart
                                        </Button>
                                    </div> */}
                                </div>
                            </div>

                            {/* Features Card */}
                            <div className="bg-white border-1 border-gray-300 rounded p-6">
                                <h3 className="font-bold text-lg mb-4">This course includes:</h3>
                                <div className="space-y-3 ">
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <Clock className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>{course.course_duration} hours video</span>
                                    </div>
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <BookOpen className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>Downloadable resources</span>
                                    </div>
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <BadgeCheck className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>Certificate of completion</span>
                                    </div>
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <Shield className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>Full lifetime access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Courses Section */}
                <div className="mt-8">
                    <div className="mb-4 text-center">
                    </div>
                    <RecommendedCourses courseSlug={course.slug} />
                </div>
            </div>
        </div>
    )
}
// Combined Skeleton Loader
const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-4">
        {/* Hero Section Skeleton */}
        <div className="bg-gray-200 h-64 rounded-lg mb-8 animate-pulse"></div>

        {/* Main Content Skeleton */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Left Content - 2/3 width */}
            <div className="md:col-span-2 space-y-6">
                {/* Text Block */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>

                {/* List Items */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
                                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - 1/3 width */}
            <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <div className="h-8 w-1/2 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>

        {/* Recommended Courses Skeleton */}
        <div className="max-w-6xl mx-auto mt-12 space-y-4">
            <div className="h-6 w-1/4 bg-gray-200 rounded mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>


    </div>
);


export default CourseDetails