import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useListCourseReviewsQuery } from '@/features/api/reviewApi';
import { useLoadCourseQuery } from '@/features/api/courseApi';
import { ArrowLeft, Star } from 'lucide-react';

const CourseReviewsPage = () => {
    const { slug } = useParams();
    const { data: courses } = useLoadCourseQuery();
    const { data: reviews, isLoading, error } = useListCourseReviewsQuery(slug);
    
    const course = courses?.find(c => c.slug === slug);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 bg-gray-100 w-1/4 mb-8 animate-pulse"></div>
                    <div className="space-y-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-5 bg-gray-100 w-1/3 mb-3"></div>
                                <div className="h-4 bg-gray-100 w-1/6 mb-4"></div>
                                <div className="h-3 bg-gray-100 w-full mb-2"></div>
                                <div className="h-3 bg-gray-100 w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-12">
                <div className="text-center p-8 max-w-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Failed to load reviews</h2>
                    <p className="text-gray-600 mb-6">Please try again later.</p>
                    <Link to={`/course/${slug}`} className="text-blue-600 hover:text-blue-800 underline">
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    const averageRating = reviews && reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-white py-12 px-4 mt-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link 
                        to={`/courses/course-detail/${slug}`}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Course
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reviews for {course?.title}
                    </h1>
                </div>

                {/* Average Rating */}
                {reviews && reviews.length > 0 && (
                    <div className="mb-12 pb-8 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">Overall Rating</h2>
                                <div className="flex items-center">
                                    <span className="text-4xl font-bold text-gray-900 mr-4">{averageRating}</span>
                                    <div className="flex mr-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={24}
                                                className={i < Math.round(averageRating) 
                                                    ? 'text-yellow-400 fill-yellow-400' 
                                                    : 'text-gray-200'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-500">{reviews.length} reviews</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = reviews.filter(r => r.rating === rating).length;
                                        const percentage = (count / reviews.length) * 100;
                                        return (
                                            <div key={rating} className="flex items-center">
                                                <span className="w-12 text-sm text-gray-900">{rating} star</span>
                                                <div className="w-32 h-1 bg-gray-400 mx-3">
                                                    <div 
                                                        className="h-1 bg-yellow-400" 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="w-8 text-sm text-gray-900">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-8">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={review.id} className={`py-6 ${index < reviews.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-medium text-gray-900 mb-2">
                                            {review.student_name || 'Anonymous User'}
                                        </p>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating 
                                                        ? 'text-yellow-400 fill-yellow-400' 
                                                        : 'text-gray-200'
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {review.review_text && (
                                    <p className="text-gray-700 leading-relaxed">
                                        {review.review_text}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                            <p className="text-gray-500">Be the first to review this course!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseReviewsPage;