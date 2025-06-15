import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { Clock, Play, BookOpen, Award, Check, Globe, ChevronRight, BarChart2, HelpCircle, Shield, BadgeCheck, User, Calendar, Target, Download, ArrowBigDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoadUserQuery } from '@/features/api/authApi'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import ReactPlayer from 'react-player/youtube'
import RecommendedCourses from './RecommendedCourses'

const CourseDetails = () => {
    const { slug } = useParams()
    const { data, isLoading, error } = useLoadCourseQuery()
    const { data: user, isLoading: isLoadingUser, refetch } = useLoadUserQuery();
    const navigate = useNavigate();

    // Loading state
    // Loading state
if (isLoading) return (
  <div className="min-h-screen bg-gray-50">
    {/* Hero Section Skeleton */}
    <div className="bg-gray-200 h-96 animate-pulse">
      <div className="container mx-auto px-4 py-12 md:py-16 h-full flex items-end">
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
          <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
          <div className="h-6 w-3/4 bg-gray-300 rounded-lg"></div>
          <div className="flex gap-4">
            <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Content Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <div className="h-8 w-32 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Courses Skeleton */}
      <div className="mt-16 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
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

    const handlePayWithKhalti = () => {
        if (user) {
            navigate(`/checkout/${course.slug}`)
        } else {
            navigate(`/login?redirect=/checkout/${course.slug}`)
        }
    }

    return (
        <div className="min-h-screen mt-14 bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Course Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 bg-white text-gray-900 text-sm font-medium rounded-full">
                                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                </span>
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

                            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight">
                                {course.title}
                            </h1>

                            {/* <p className="text-lg text-gray-300 max-w-3xl">
                                {course.short_description || course.description.substring(0, 150) + '...'}
                            </p> */}

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg">
                                    <Clock className="h-5 w-5 mr-2" />
                                    <span>{course.course_duration} hours</span>
                                </div>
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg">
                                    <Globe className="h-5 w-5 mr-2" />
                                    {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
                                </div>
                            </div>
                        </div>

                        {/* Course Thumbnail */}
                        <div className="lg:col-span-1">
                            <div className="relative rounded-xl overflow-hidden shadow-xl">
                                <img
                                    src={course.thumbnail || "/course1.png"}
                                    alt={course.title}
                                    className="w-full h-52 object-fit"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <button
                                        onClick={() => window.open('https://youtu.be/TjCRfuIsOEE?si=zmZ0DbKROE5gg8Yh', '_blank')}
                                        className="bg-white rounded-full p-4 hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <Play className="h-6 w-6 text-gray-900 fill-current" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                    <p className="text-white text-sm font-medium">Preview this course</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <Award className="h-6 w-6 mr-3 text-blue-600" />
                                Course Description
                            </h2>
                            <div className="prose max-w-none text-gray-700">
                                <p className="text-base leading-relaxed">{course.description}</p>
                            </div>
                        </div>

                        {/* Requirements & Outcomes */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                                <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {course.learning_outcomes?.split('\n').filter(Boolean).map((outcome, index) => (
                                        <div key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{outcome.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                                <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                                <ul className="space-y-3">
                                    {course.requirements?.split('\n').filter(Boolean).map((req, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{req.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Syllabus */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                            <div className="space-y-4">
                                {course.syllabus?.split('\n').filter(Boolean).map((line, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <h3 className="text-lg font-semibold text-gray-800">{line.trim()}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Pricing Card */}
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            रू{course.price}
                                            {course.original_price && (
                                                <span className="text-lg text-gray-500 line-through ml-2">
                                                    रू{course.original_price}
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

                                <div className="p-6 space-y-4">
                                    {!isLoadingUser ? (
                                        <Button
                                            onClick={handlePayWithKhalti}
                                            className="w-full py-6 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                                        >
                                            Enroll Now
                                        </Button>
                                    ) : (
                                        <Button disabled className="w-full py-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Loading...
                                        </Button>
                                    )}

                                    <p className="text-center text-sm text-gray-500">
                                        One-time payment • Lifetime access
                                    </p>

                                    <div className="pt-2">
                                        <Button variant="outline" className="w-full py-6 text-lg">
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Features Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-lg mb-4">This course includes:</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-gray-600 mr-3" />
                                        <span className="text-gray-700">{course.course_duration} hours on-demand video</span>
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="h-5 w-5 text-gray-600 mr-3" />
                                        <span className="text-gray-700">Downloadable resources</span>
                                    </div>
                                    <div className="flex items-center">
                                        <BadgeCheck className="h-5 w-5 text-gray-600 mr-3" />
                                        <span className="text-gray-700">Certificate of completion</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 text-gray-600 mr-3" />
                                        <span className="text-gray-700">Full lifetime access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Courses Section */}
                <div className="mt-16">
                    <div className="mb-8 text-center">
                    </div>
                    <RecommendedCourses courseSlug={course.slug} />
                </div>
            </div>
        </div>
    )
}

export default CourseDetails