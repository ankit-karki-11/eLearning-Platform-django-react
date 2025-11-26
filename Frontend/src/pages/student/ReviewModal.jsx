import React, { useState, useEffect } from 'react';
import { useSubmitReviewMutation } from '@/features/api/reviewApi';
import { toast } from 'sonner';

// EMBEDDED StarRating Component (no separate file needed)
const StarRating = ({ rating, onRatingChange, disabled = false }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !disabled && onRatingChange(star)}
                    className={`text-2xl transition-transform ${!disabled && 'hover:scale-110'} ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
                        } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                    aria-label={`Rate ${star} stars`}
                    disabled={disabled}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

// ✨ Main ReviewModal Component
const ReviewModal = ({ isOpen, onClose, courseSlug, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitReview, { isLoading }] = useSubmitReviewMutation();

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setRating(0);
            setReviewText('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        try {
            await submitReview({
                course_slug:courseSlug,
                rating,
                review_text: reviewText,
            }).unwrap();

            toast.success("Thank you for your review!");
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err?.data?.error || "Failed to submit review. Please try again.");
        }
    };

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.keyCode === 27) onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Rate This Course</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>

                    {/* ✨ Star Rating Input — Embedded Component */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating *
                        </label>
                        <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review (Optional)
                        </label>
                        <textarea
                            id="review-text"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What did you think of this course? Your feedback helps others!"
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !rating}
                            className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-black disabled:opacity-50 transition cursor-pointer"
                        >
                            {isLoading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;