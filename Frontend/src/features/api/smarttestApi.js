import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = "http://localhost:8000/api/v1/smarttest/";

export const smarttestApi = createApi({
    reducerPath: "smarttestApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Test', 'Topic', 'Attempt'],

    endpoints: (builder) => ({
        // Topics (Admin can create, students can list)
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

        // Tests (Admin CRUD, students list public)
        getTests: builder.query({
            query: () => "tests/",
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

        // Test Attempts (student only)
        getMyAttempts: builder.query({
            query: () => "test-attempts/",
            providesTags: ['Attempt'],
        }),
        getAttemptDetails: builder.query({
            query: (attemptId) => `test-attempts/${attemptId}/`,
            providesTags: (result, error, attemptId) => [{ type: 'Attempt', id: attemptId }],
        }),

        // Start a formal test attempt by test ID (admin created test)
        startAttempt: builder.mutation({
            query: (testId) => ({
                url: "test-attempts/",
                method: "POST",
                body: { test_id: testId },
            }),
            invalidatesTags: ['Attempt'],
        }),

        // Start a practice attempt by topic and level (dynamic questions)
        startPracticeAttempt: builder.mutation({
            query: ({ topicId, level }) => ({
                url: "test-attempts/",
                method: "POST",
                body: {
                    topic_id: topicId,
                    level: level,
                },
            }),
            invalidatesTags: ['Attempt'],
        }),

        // Submit answer for a question in an attempt
        submitAnswer: builder.mutation({
            query: ({ attemptId, questionId, selectedOptionId }) => ({
                url: "results/",  // match your backend endpoint for submitting answers
                method: "POST",
                body: {
                    attempt: attemptId,
                    question: questionId,
                    selected_option: selectedOptionId,
                },
            }),
            invalidatesTags: (result, error, { attemptId }) => [
                { type: 'Attempt', id: attemptId },
            ],
        }),

        // Submit whole test attempt (finish test)
        submitAttempt: builder.mutation({
            query: ({ attemptId, results }) => ({
                url: `test-attempts/${attemptId}/submit/`,
                method: "POST",
                body: { results },
            }),
            invalidatesTags: ['Attempt'],
        }),
    }),
});

export const {
    useGetTopicsQuery,
    useCreateTopicMutation,
    useGetTestsQuery,
    useGetTestDetailsQuery,
    useCreateTestMutation,
    useGetMyAttemptsQuery,
    useGetAttemptDetailsQuery,
    useStartAttemptMutation,
    useStartPracticeAttemptMutation,
    useSubmitAnswerMutation,
    useSubmitAttemptMutation,
} = smarttestApi;
