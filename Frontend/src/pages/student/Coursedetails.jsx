import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { Clock, File, FileArchiveIcon, Play, Star, Users, BookOpen, Award, Check, Globe, ChevronRight, BarChart2, HelpCircle, Shield, BadgeCheck, User, Calendar, Target, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoadUserQuery } from '@/features/api/authApi'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

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

    const handleEnroll = () => {
        if (user) {
            navigate(`/payment/${course.slug}`)
        } else {
            navigate(`/login?redirect=/payment/${course.slug}`)
        }
    }

    // Sample course data
    const courseSections = [
        {
            title: "Introduction to ReactJS",
            duration: "45 min",
            lessons: 2,
            completed: 1,
            resources: 2
        },
        {
            title: "Core Concepts",
            duration: "1.2 hrs",
            lessons: 2,
            completed: 1,
            resources: 2
        }
    ]

    const learningOutcomes = [
        "Master React fundamentals and core concepts",
        "Build dynamic, interactive web applications",
       
    ]

    const features = [
        { icon: <FileArchiveIcon className="h-5 w-5" />, text: "Certificate of completion" },
        { icon: <Clock className="h-5 w-5" />, text: "Lifetime access" },
      
    ]

    
    // Calculate overall progress
    const totalLessons = courseSections.reduce((sum, section) => sum + section.lessons, 0)
    const completedLessons = courseSections.reduce((sum, section) => sum + section.completed, 0)
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

    return (
        <div className="min-h-screen mt-14">
            {/* Breadcrumb */}
            {/* <div className="border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-500">Home</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Courses</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{course.title}</span>
                    </div>
                </div>
            </div> */}

            {/* Hero Section */}
            <div className="bg-gray-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Course Info - 2 columns */}
                        <div className="lg:col-span-2">
                            {/* Course Tags */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-white text-gray-900 text-sm font-medium rounded-full">
                                    {course.level}
                                </span>
                                <div className="flex items-center text-yellow-400">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm">4.8 (2.3k)</span>
                                </div>
                                <span className="text-sm text-gray-300 flex items-center">
                                    <Users className="h-4 w-4 mr-1" /> 12,450 students
                                </span>
                                <span className="text-sm text-gray-300 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" /> Updated 2024
                                </span>
                            </div>

                            {/* Course Title */}
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {course.title}
                            </h1>

                            {/* Course Description */}
                            {/* <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                {course.description}
                            </p> */}

                            {/* Course Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-2" />
                                    <span>{course.course_duration}h total</span>
                                </div>
                                {/* <div className="flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    <span>{courseSections.length} sections</span>
                                </div> */}
                                <div className="flex items-center">
                                    <Globe className="h-5 w-5 mr-2" />
                                    <span>{course.language}</span>
                                </div>
                                {/* <div className="flex items-center">
                                    <Download className="h-5 w-5 mr-2" />
                                    <span>Resources</span>
                                </div> */}
                            </div>

                            
                        </div>

                        {/* Course Preview - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="relative rounded-lg overflow-hidden">
                                <img
                                    src={course.thumbnail || "/course1.png"}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
                                    <button className="bg-white rounded-full p-3 hover:scale-110 transition-transform">
                                        <Play className="h-6 w-6 text-red-400 fill-current" />
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
                            {/* <div className="p-4 border rounded-lg text-center"> */}
                               <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <Award className="h-6 w-6 mr-3" />
                                Description
                            </h2>
                                <p className="text-sm text-gray-600"> {course.description}</p>
                            {/* </div> */}
                           
                        </div>

                        {/* Learning Outcomes */}
                        <div className="border rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <Award className="h-6 w-6 mr-3" />
                                What you'll learn
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {learningOutcomes.map((outcome, index) => (
                                    <div key={index} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="border rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <BookOpen className="h-6 w-6 mr-3" />
                                    Course Content
                                </h2>
                                <div className="text-sm text-gray-600">
                                    {courseSections.length} sections • {totalLessons} lessons
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {completedLessons > 0 && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Course Progress</span>
                                        <span className="text-sm text-gray-600">{progressPercentage}%</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                </div>
                            )}

                            {/* Sections */}
                            <div className="space-y-4">
                                {courseSections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="border rounded-lg overflow-hidden">
                                        {/* Section Header */}
                                        <div className="bg-gray-50 px-4 py-3">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                                                    <h3 className="font-medium">{section.title}</h3>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {section.duration} • {section.lessons} lessons
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Section Content */}
                                        <div className="divide-y">
                                            {Array.from({ length: section.lessons }).map((_, lessonIndex) => (
                                                <div key={lessonIndex} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                                                    <div className="flex items-center">
                                                        <Play className="h-4 w-4 text-gray-500 mr-3" />
                                                        <span className="text-gray-700">
                                                            Lesson {lessonIndex + 1}: {section.title} fundamentals
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">10 min</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements & Description */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                        Basic HTML, CSS, JavaScript knowledge
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                        Computer with internet connection
                                    </li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Who is this for?</h2>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <Target className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                        Beginner developers
                                    </li>
                                    <li className="flex items-start">
                                        <Target className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                        Frontend developers
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Course Features */}
                        <div className="border rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Course Features</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-gray-600 mr-3">{feature.icon}</div>
                                        <span className="text-gray-700">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Pricing Card */}
                            <div className="border rounded-lg overflow-hidden">
                                {/* Price Header */}
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

                                {/* Purchase Section */}
                                <div className="p-6">
                                    {!isLoadingUser ? (
                                        <Button
                                            onClick={handleEnroll}
                                            className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Pay Via eSewa
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

                                    {/* Money Back Guarantee */}
                                    <div className="mt-4 p-3 rounded-lg text-center">
                                       <Button variant="outline">Add to Cart</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Course Includes */}
                            <div className="border rounded-lg p-6">
                                <h3 className="font-bold mb-4">This course includes:</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-500 mr-3" />
                                        <span className="text-sm">{course.course_duration} hours on-demand video</span>
                                    </div>
                                   
                                    <div className="flex items-center">
                                        <BadgeCheck className="h-4 w-4 text-gray-500 mr-3" />
                                        <span className="text-sm">Certificate of completion</span>
                                    </div>
                                    {/* <div className="flex items-center">
                                        <Users className="h-4 w-4 text-gray-500 mr-3" />
                                        <span className="text-sm">Access to community</span>
                                    </div> */}
                                </div>
                            </div>

                            {/* Share Course */}
                            {/* <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-3">Share this course</h3>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1">Share</Button>
                                    <Button variant="outline" size="sm" className="flex-1">Wishlist</Button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetails