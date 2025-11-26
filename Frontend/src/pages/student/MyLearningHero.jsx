import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoadMyEnrollmentsQuery } from '@/features/api/enrollmentApi';
import { useGetUserReviewsQuery } from '@/features/api/reviewApi';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import ReviewModal from './ReviewModal';

const MyLearningHero = () => {
    const { data: enrollments, isLoading, refetch: refetchEnrollments } = useLoadMyEnrollmentsQuery();
    const { data: userReviews, refetch: refetchUserReviews } = useGetUserReviewsQuery();
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);

    // Review Modal state
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedCourseSlug, setSelectedCourseSlug] = useState('');
    const [refreshKey, setRefreshKey] = useState(0); // force re-render after review

    // Check if scroll container is overflowing
    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) setShowArrows(container.scrollWidth > container.clientWidth);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [enrollments]);

    const scroll = (direction) => {
        if (!scrollContainerRef.current) return;
        const cardWidth = 620;
        scrollContainerRef.current.scrollBy({
            left: direction === 'right' ? cardWidth * 2 : -cardWidth * 2,
            behavior: 'smooth'
        });
    };

    const handleOpenReviewModal = (courseSlug, e) => {
        e.stopPropagation();
        setSelectedCourseSlug(courseSlug);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedCourseSlug('');
    };

    const handleReviewSuccess = () => {
        refetchUserReviews();
        refetchEnrollments();
        setRefreshKey(prev => prev + 1); // force re-render
        setIsReviewModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Learning</h2>
                    <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
                </div>
                <div className="flex space-x-6 overflow-x-auto pb-6 hide-scrollbar">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 min-w-[580px] flex items-start space-x-4 animate-pulse">
                            <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mr-4">Let's start learning</h2>
                {enrollments && enrollments.length > 0 && (
                    <button
                        onClick={() => navigate('/courses/my-learning')}
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center font-medium"
                    >
                        My Learning
                    </button>
                )}
            </div>

            {!enrollments || enrollments.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No courses enrolled yet</h3>
                    <p className="text-gray-600 mb-4">Start your learning journey by exploring our courses</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-gray-900 text-white px-4 py-2 rounded-sm hover:bg-gray-900 transition-colors cursor-pointer text-sm"
                    >
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="relative">
                    {showArrows && (
                        <>
                            <button
                                className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200"
                                onClick={() => scroll('left')}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={24} className="text-gray-700" />
                            </button>
                            <button
                                className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200"
                                onClick={() => scroll('right')}
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={24} className="text-gray-700" />
                            </button>
                        </>
                    )}

                    <div
                        ref={scrollContainerRef}
                        key={refreshKey} // re-render when review submitted
                        className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar scroll-smooth snap-x"
                    >
                        {enrollments.map((enrollment) => {
                            const userRating = userReviews?.find(
                                review => review.course_slug === enrollment.course.slug
                            )?.rating;

                            return (
                                <div
                                    key={enrollment.course.slug}
                                    className="bg-white rounded-xl border border-gray-200 p-4 min-w-[580px] snap-start hover:shadow-md cursor-pointer group transition-shadow flex items-start space-x-5"
                                    onClick={() => navigate(`/course/${enrollment.course.slug}/progress`)}
                                >
                                    <div className="w-48 h-32 overflow-hidden rounded-lg flex-shrink-0">
                                        <img
                                            src={enrollment.course.thumbnail || '/default.png'}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                                {enrollment.course.title}
                                            </h3>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-600">
                                                    {enrollment.course.level.charAt(0).toUpperCase() + enrollment.course.level.slice(1)}
                                                </span>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                                                    <span>Progress</span>
                                                    {enrollment.status === 'completed' || enrollment.status === 'certified' ? (
                                                        <span className={`text-xs px-2 py-1 rounded font-medium ${enrollment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-900 text-white'}`}>
                                                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                                        </span>
                                                    ) : (
                                                        <span className="font-medium">{enrollment.progress.toFixed(0)}%</span>
                                                    )}
                                                </div>
                                                <div className="w-full h-1 bg-gray-200 rounded-full">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${enrollment.status === 'completed' || enrollment.status === 'certified' ? 'bg-gray-900' : 'bg-gray-900'}`}
                                                        style={{ width: `${enrollment.progress.toFixed(0)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-20 mt-0">
                                            {enrollment.status === 'certified' && (
                                                <div
                                                    className="flex items-center text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-900 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/certificate/${enrollment.course.slug}`);
                                                    }}
                                                >
                                                    View Certificate
                                                    <ArrowRight size={12} className="ml-1" />
                                                </div>
                                            )}

                                            {(enrollment.status === 'completed' || enrollment.status === 'certified') && (
                                                <div className="flex items-center">
                                                    {userRating ? (
                                                        <div className="flex items-center text-amber-600">
                                                            <span className="text-xs font-medium mr-1">Your rating:</span>
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={12}
                                                                        className={i < userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                                    />
                                                                ))}
                                                                <span className="ml-1 text-xs font-medium">({userRating}.0)</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="flex items-center text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-900 transition-colors"
                                                            onClick={(e) => handleOpenReviewModal(enrollment.course.slug, e)}
                                                        >
                                                            Leave Review
                                                            <ArrowRight size={12} className="ml-1" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReviewModal}
                courseSlug={selectedCourseSlug}
                onSuccess={handleReviewSuccess}
            />

            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .scroll-smooth {
                    scroll-behavior: smooth;
                }
                .snap-x {
                    scroll-snap-type: x proximity;
                }
                .snap-start {
                    scroll-snap-align: start;
                }
            `}</style>
        </div>
    );
};

export default MyLearningHero;
