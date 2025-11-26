import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { useLoadUserQuery } from '@/features/api/authApi'
import { useLoadMyEnrollmentsQuery, useStartFreeCourseMutation } from '@/features/api/enrollmentApi'
import { Clock, Play, BookOpen, Calendar, Languages, User2, CheckCircle, CheckSquare2, BadgeCheck, Dock, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RecommendedCourses from './RecommendedCourses'
import { Link } from 'react-router-dom';
import { useListCourseReviewsQuery } from '@/features/api/reviewApi';
import { Star } from 'lucide-react';

const CourseDetails = () => {
    const { slug } = useParams()
    const navigate = useNavigate()

    const { data: courses, isLoading, error } = useLoadCourseQuery()
    const { data: user, isLoading: isLoadingUser } = useLoadUserQuery()
    const { data: enrollments } = useLoadMyEnrollmentsQuery()
    const { data: reviews, isLoading: reviewsLoading } = useListCourseReviewsQuery(slug);
    const [startFreeCourse] = useStartFreeCourseMutation();
    // Find the current course
    const course = courses?.find(c => c.slug === slug)

    // Check if user is enrolled
    const enrollment = enrollments?.find(e => e.course.slug === slug)
    const isEnrolled = !!enrollment

    // Loading state
    if (isLoading) return <LoadingSkeleton />

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

    const handleContinueCourse = () => {
        if (user) {
            navigate(`/course/${course.slug}/progress`)
        } else {
            navigate(`/login?redirect=/checkout/${course.slug}`)
        }
    }

    // const [startFreeCourse] = useStartFreeCourseMutation();

    const handleEnroll = async () => {
        if (!user) {
            navigate(`/login?redirect=/checkout/${course.slug}`);
            return;
        }

        if (course.price == 0) {
            try {
                await startFreeCourse(course.slug).unwrap();
                // optionally refetch enrollments or redirect to course progress
                navigate(`/course/${course.slug}/progress`);
            } catch (err) {
                console.error("Failed to start free course:", err);
            }
        } else {
            navigate(`/checkout/${course.slug}`);
        }
    };


    return (
        <div className="min-h-screen mt-8 bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white">
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
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg text-xs">
                                    <User2 className="h-4 w-4 mr-2" />
                                    <span>Students Enrolled: {course.total_enrolled}</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-3xl lg:text-3xl font-bold leading-tight">
                                {course.title}
                            </h1>
                            {/* <p className="text-3xl md:text-xl lg:text-1xl leading-tight">
                                {course.description}
                            </p> */}


                            <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg text-xs">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>{course.course_duration} hours ({course.sections.length} video/s)</span>
                                </div>
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg text-xs">
                                    <Languages className="h-4 w-4 mr-2" />
                                    {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
                                </div>
                                <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg text-xs gap-1">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    <span>{course.average_rating?.toFixed(1) || "0.0"}/5</span>
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
                                        className="bg-gray-200 rounded-full p-4 hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <Play className="h-6 w-6 text-gray-900 fill-current cursor-pointer" />
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

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Description Card */}
                        <div className="bg-white border-1 border-gray-300 rounded p-4 md:p-4">
                            <h2 className="text-xl font-bold mb-2 flex items-center">Description</h2>
                            <div className="prose max-w-none text-shadow-black">
                                <p className="text-sm leading-relaxed">{course.description}</p>
                            </div>
                        </div>

                        {/* What you'll learn */}
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

                        {/* Requirements */}
                        <div className="bg-white border-1 border-gray-300 rounded p-4 md:p-4">
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

                        {/* Syllabus */}
                        <div className="bg-white border-1 border-gray-300 rounded p-4 md:p-4">
                            <h2 className="text-xl font-bold mb-4">Course Content</h2>
                            <div className="grid md:grid-cols-1 gap-2 text-sm">
                                {course.syllabus?.split('\n').filter(Boolean).map((line, index) => (
                                    <div key={index} className="flex items-start">
                                        <CheckSquare2 className="h-4 w-4 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <span className="text-gray-800">{line.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Pricing Card */}
                            <div className="bg-white border-1 border-gray-300 rounded overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {course.price == 0 ? (
                                                "Free Course"
                                            ) : (
                                                <>
                                                    Rs {course.price}
                                                    {course.original_price && course.original_price > course.price && (
                                                        <span className="text-lg text-gray-500 line-through ml-2">
                                                            Rs {course.original_price}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {/* {course.original_price && (
                                            <p className="text-sm text-green-600 font-medium">
                                                {Math.round((1 - course.price / course.original_price) * 100)}% discount
                                            </p>
                                        )} */}
                                    </div>
                                </div>

                                <div className="p-4 space-y-2">
                                    {!isLoadingUser ? (
                                        <Button
                                            onClick={isEnrolled ? handleContinueCourse : handleEnroll}
                                            className="w-full py-6 text-m bg-gray-900 hover:bg-gray-950 text-white cursor-pointer"
                                        >
                                            {isEnrolled ? 'Continue Course' : 'Enroll now'}
                                        </Button>
                                    ) : (
                                        <Button disabled className="w-full py-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Loading...
                                        </Button>
                                    )}

                                    <p className="text-center text-sm text-gray-700">
                                        One-time payment, Lifetime access
                                    </p>
                                </div>
                            </div>

                            {/* Features Card */}
                            <div className="bg-white border-1 border-gray-300 rounded p-6">
                                <h3 className="font-bold text-lg mb-2">This course includes:</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <Clock className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>{course.category.title} category</span>
                                    </div>
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <Clock className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>{course.sections.length} lectures video</span>
                                    </div>
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <BookOpen className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>{course.is_test_required ? 'Test required for this course' : 'No test required for this course'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-shadow-black">
                                        <File className="h-4 w-4 text-gray-900 mr-3" />
                                        <span>
                                            {course.is_test_required
                                                ? 'Certificate awarded upon test completion'
                                                : 'No Certificate of completion'}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* Reviews Card */}
                            <div className="bg-white border border-gray-300 rounded p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Reviews ({reviews?.length || 0})</h3>
                                    {reviews && reviews.length > 0 && (
                                        <Link
                                            to={`/course/${course.slug}/reviews`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View All →
                                        </Link>
                                    )}
                                </div>

                                {reviewsLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(2)].map((_, i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/6 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : reviews && reviews.length > 0 ? (
                                    <>
                                        {/* Average Rating */}
                                        <div className="flex items-center mb-4 border-b border-gray-200 pb-3">
                                            <div className="flex items-center mr-3">
                                                <span className="text-2xl font-bold text-gray-900 mr-2">
                                                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                                                </span>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-700">out of 5</span>
                                        </div>

                                        {/* Show only 2-3 reviews */}
                                        <div className="space-y-4">
                                            {reviews.slice(0, 3).map((review) => (
                                                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {review.student_name
                                                                ? review.student_name
                                                                : 'Anonymous User'
                                                            }
                                                        </p>
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={12}
                                                                    className={i < review.rating
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : 'text-gray-500'
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.review_text && (
                                                        <p className="text-sm text-gray-800 mt-1 leading-relaxed line-clamp-2">
                                                            {review.review_text}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-700 mt-2">
                                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Show "View All" link at bottom if there are more than 3 reviews */}
                                        {reviews.length > 3 && (
                                            <div className="mt-4 pt-3 border-t border-gray-200">
                                                <Link
                                                    to={`/course/${course.slug}/reviews`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium block text-center"
                                                >
                                                    View All {reviews.length} Reviews →
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this course!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Courses Section */}
                <div className="mt-8">
                    <RecommendedCourses courseSlug={course.slug} />
                </div>
            </div>
        </div>
    )
}

// Skeleton Loader
const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-gray-200 h-64 rounded-lg mb-8 animate-pulse"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
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
            <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <div className="h-8 w-1/2 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
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
