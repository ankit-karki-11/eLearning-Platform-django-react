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
    tagTypes: ['Test', 'Topic', 'Attempt'],
    endpoints: (builder) => ({
        // Test Management
        getTests: builder.query({
            query: () => "tests/",
            providesTags: ['Test'],
        }),

        getMyTests: builder.query({
            query: () => 'tests/my_tests/',
            providesTags: ['Test'],
        }),

        getTestDetails: builder.query({
            query: (id) => `tests/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Test', id }],
        }),

        createTest: builder.mutation({
            query: (testData) => ({
                url: "tests/",
                method: "POST",
                body: testData,
            }),
            invalidatesTags: ['Test'],
        }),

        startAttempt: builder.mutation({
            query: (testId) => ({
                url: "test-attempts/",
                method: "POST",
                body: { test_id: testId },
            }),

            invalidatesTags: ['Attempt'],
        }),

        getActiveAttempt: builder.query({
            query: (testId) => `test-attempts/active/?test_id=${testId}`,
            providesTags: ['Attempt'],
        }),

        submitAnswer: builder.mutation({
            query: ({ attemptId, questionId, response }) => ({
                url: "answers/",
                method: "POST",
                body: {
                    attempt: attemptId,
                    question: questionId,
                    response: response
                },
            }),
            invalidatesTags: (result, error, { attemptId }) => [
                { type: 'Attempt', id: attemptId }
            ],
        }),

        submitAttempt: builder.mutation({
            query: ({ testId, attemptId }) => ({
                // url: `test-attempts/test/${testId}/attempt/${attemptId}/submit/`,
                url: `test-attempts/${attemptId}/submit/`,
                method: "POST",
            }),
            invalidatesTags: ['Attempt'],
        }),
        getAttempt: builder.query({
            query: (attemptId) => `test-attempts/${attemptId}`,
            providesTags: ['Attempt']
        }),

        getAttemptResults: builder.query({
            query: ({ attemptId }) => ({
                url: `test-attempts/${attemptId}/results/`,
            }),
            providesTags: ['Attempt'],
        }),

        // Admin Management
        getTopics: builder.query({
            query: () => "topics/",
            providesTags: ['Topic'],
        }),

        createTopic: builder.mutation({
            query: (topicData) => ({
                url: "topics/",
                method: "POST",
                body: topicData,
            }),
            invalidatesTags: ['Topic'],
        }),
    }),
});

export const {
    useGetTestsQuery,
    useGetMyTestsQuery,
    useGetTestDetailsQuery,
    useCreateTestMutation,
    useStartAttemptMutation,
    useGetActiveAttemptQuery,
    useSubmitAnswerMutation,
    useSubmitAttemptMutation,
    useGetAttemptResultsQuery,
    useGetAttemptQuery,
    useGetTopicsQuery,
    useCreateTopicMutation,
} = smarttestApi;