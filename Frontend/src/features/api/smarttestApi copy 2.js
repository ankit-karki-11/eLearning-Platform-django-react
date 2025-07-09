import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const smarttestApi = createApi({
  reducerPath: 'smarttestApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api/v1/smarttest/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Topic', 'Test', 'Question', 'TestAttempt', 'Answer'],
  endpoints: (builder) => ({
    // Topic Endpoints
    getTopics: builder.query({
      query: () => 'topics/',
      providesTags: ['Topic'],
    }),
    createTopic: builder.mutation({
      query: (topic) => ({
        url: 'topics/',
        method: 'POST',
        body: topic,
      }),
      invalidatesTags: ['Topic'],
    }),

    // Test Endpoints
    getTests: builder.query({
      query: () => 'tests/',
      providesTags: ['Test'],
    }),
    getTest: builder.query({
      query: (id) => `tests/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Test', id }],
    }),
    createTest: builder.mutation({
      query: (test) => ({
        url: 'tests/',
        method: 'POST',
        body: test,
      }),
      invalidatesTags: ['Test'],
    }),
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `tests/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Test'],
    }),

    // Question Endpoints
    getQuestions: builder.query({
      query: (testId) => `tests/${testId}/questions/`,
      providesTags: (result, error, testId) => [
        { type: 'Question', id: testId },
        ...(result?.map(({ id }) => ({ type: 'Question', id })) || []),
      ],
    }),

    // Test Attempt Endpoints
    getTestAttempts: builder.query({
      query: () => 'attempts/',
      providesTags: ['TestAttempt'],
    }),
    startTestAttempt: builder.mutation({
      query: (testId) => ({
        url: 'attempts/',
        method: 'POST',
        body: { test_id: testId },
      }),
      invalidatesTags: ['TestAttempt'],
    }),
    submitTestAttempt: builder.mutation({
      query: ({ attemptId, answers }) => ({
        url: `attempts/${attemptId}/submit/`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['TestAttempt'],
    }),

    // Answer Endpoints
    createAnswer: builder.mutation({
      query: ({ attemptId, questionId, response }) => ({
        url: 'answers/',
        method: 'POST',
        body: {
          attempt: attemptId,
          question: questionId,
          response: response,
        },
      }),
      invalidatesTags: ['Answer', 'TestAttempt'],
    }),
    updateAnswer: builder.mutation({
      query: ({ answerId, response }) => ({
        url: `answers/${answerId}/`,
        method: 'PATCH',
        body: { response },
      }),
      invalidatesTags: ['Answer', 'TestAttempt'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTopicsQuery,
  useCreateTopicMutation,
  useGetTestsQuery,
  useGetTestQuery,
  useCreateTestMutation,
  useDeleteTestMutation,
  useGetQuestionsQuery,
  useGetTestAttemptsQuery,
  useStartTestAttemptMutation,
  useSubmitTestAttemptMutation,
  useCreateAnswerMutation,
  useUpdateAnswerMutation,
} = smarttestApi;