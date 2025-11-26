import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = "http://localhost:8000/api/v1/main/";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        // Submit a review (authenticated, completed/certified only)
        submitReview: builder.mutation({
            query: ({ course_slug, rating, review_text }) => ({ 
                // url: `reviews/course/course_slug=${courseSlug}/`,
                url: `reviews/`,
                method: 'POST',
                body: { course_slug, rating, review_text },
            }),
            invalidatesTags: ['Review'], // Invalidate cache after submit
        }),

        // List reviews for a specific course (PUBLIC)
        listCourseReviews: builder.query({
            query: (courseSlug) => ({
                url: `reviews/?course_slug=${courseSlug}`,
                method: 'GET',
            }),
            providesTags: ['Review'],
        }),

        // get current user's reviews (authenticated only)
        getUserReviews: builder.query({
            query: () => ({
                url: 'reviews/',
                method: 'GET',
            }),
            providesTags: ['Review'],
        }),

        // check if user already reviewed this course (optional helper)
        checkReviewStatus: builder.query({
            query: (courseSlug) => ({
                url: `reviews/check/${courseSlug}/`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useSubmitReviewMutation,
    useListCourseReviewsQuery,
    useGetUserReviewsQuery,
    useCheckReviewStatusQuery,
} = reviewApi;