import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = "http://localhost:8000/api/v1/main/";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState, endpoint }) => {
            // Only add auth token for endpoints that need it
            const publicEndpoints = ['listCourseReviews']; // Add other public endpoints here
            
            if (!publicEndpoints.includes(endpoint)) {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        // Submit a review (authenticated, completed/certified only) - NEEDS AUTH
        submitReview: builder.mutation({
            query: ({ course_slug, rating, review_text }) => ({ 
                url: `reviews/`,
                method: 'POST',
                body: { course_slug, rating, review_text },
            }),
            invalidatesTags: ['Review'],
        }),

        // List reviews for a specific course 
        // For GET NO AUTH NEEDED-> in reviewviewset/get_permissions it allows anyone to view reviews
        listCourseReviews: builder.query({
            query: (courseSlug) => ({
                url: `reviews/?course_slug=${courseSlug}`,
                method: 'GET',
            }),
            providesTags: ['Review'],
        }),

        // get current user's reviews (authenticated only) - NEEDS AUTH
        getUserReviews: builder.query({
            query: () => ({
                url: 'reviews/',
                method: 'GET',
            }),
            providesTags: ['Review'],
        }),
    }),
});

export const {
    useSubmitReviewMutation,
    useListCourseReviewsQuery,
    useGetUserReviewsQuery,
    useCheckReviewStatusQuery,
} = reviewApi;