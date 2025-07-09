import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const SMARTTEST_API = "http://localhost:8000/api/v1/smarttest/";

export const smarttestApi = createApi({
    reducerPath: "smarttestApi",
    baseQuery: fetchBaseQuery({
        baseUrl: SMARTTEST_API,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Test', 'Topic', 'Attempt'], // For cache invalidation
    endpoints: (builder) => ({
        // Create a new test
        createTest: builder.mutation({
            query: ({ title, topic_id, level }) => ({
                url: "tests/",
                method: "POST",
                body: { 
                    title,
                    topic_id,
                    level 
                }, // Removed the nested 'data' object
            }),
            invalidatesTags: ['Test'],
        }),
        
        // Get all tests
        getTest: builder.query({
            query: () => "tests/",
            providesTags: ['Test'],
        }),

        // Get all topics
        getTopics: builder.query({
            query: () => "topics/",
            providesTags: ['Topic'],
            transformResponse: (response) => {
                // Ensure we always return an array
                return Array.isArray(response) ? response : [];
            },
        }),

        // Get test details by ID
        getTestDetails: builder.query({
            query: (id) => `tests/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Test', id }],
        }),

        // Submit an answer
        submitAnswer: builder.mutation({
            query: (data) => ({
                url: "answers/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Attempt'],
        }),

        // Get user's test attempts
        getMyAttempts: builder.query({
            query: () => "my-attempts/",
            providesTags: ['Attempt'],
        }),
    }),
});

export const {
    useCreateTestMutation,
    useGetTestQuery,
    useGetTopicsQuery,
    useSubmitAnswerMutation,
    useGetMyAttemptsQuery,
    useGetTestDetailsQuery,
} = smarttestApi;