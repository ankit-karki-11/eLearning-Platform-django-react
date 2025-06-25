import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ENROLLMENT_API = "http://localhost:8000/api/v1/main/";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENROLLMENT_API,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Enrollment'],
  endpoints: (builder) => ({
    LoadMyEnrollments: builder.query({
      query: () => ({
        url: "enrollments/",
        method: "GET",
      }),
      providesTags: ['Enrollment'],
    }),
    GetEnrolledCourseDetail: builder.query({
      query: (slug) => ({
        url: `enrollments/${slug}/`,
        method: "GET",
      }),
      providesTags: ['Enrollment'],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log('GetEnrolledCourseDetail query started for slug:', arg);
        try {
          const { data } = await queryFulfilled;
          console.log('GetEnrolledCourseDetail data:', data);
        } catch (error) {
          console.error('GetEnrolledCourseDetail error:', error);
        }
      },
    }),
    GetCourseSectionProgress: builder.query({
      query: ({ courseSlug, sectionId }) => ({
        url: `enrollments/${courseSlug}/section/${sectionId}/`,
        method: "GET",
      }),
      providesTags: ['Enrollment'],
    }),
    MarkSectionAsCompleted: builder.mutation({
      query: ({ courseSlug, sectionId }) => ({
        url: `enrollments/${courseSlug}/section/${sectionId}/completed/`,
        method: "POST",
      }),
      invalidatesTags: ['Enrollment'],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log('MarkSectionAsCompleted mutation started:', arg);
        try {
          await queryFulfilled;
          console.log('MarkSectionAsCompleted mutation succeeded');
        } catch (error) {
          console.error('MarkSectionAsCompleted error:', error);
        }
      },
    }),

    UpdateLastAccessed: builder.mutation({
      query: ({ courseSlug }) => ({
        url: `enrollments/${courseSlug}/update-last-accessed/`,
        method: "PATCH",
      }),
      invalidatesTags: ['Enrollment'],
    }),

  }),
});

export const {
  useLoadMyEnrollmentsQuery,
  useGetEnrolledCourseDetailQuery,
  useGetCourseSectionProgressQuery,
  useMarkSectionAsCompletedMutation,
  useUpdateLastAccessedMutation,
} = enrollmentApi;