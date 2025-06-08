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
  endpoints: (builder) => ({
    // Load all enrollments of logged-in user
    LoadMyEnrollments: builder.query({
      query: () => ({
        url: "enrollments/",
        method: "GET",
      }),
    }),

    // Get detail of a specific enrolled course
    GetEnrolledCourseDetail: builder.query({
      query: (slug) => ({
        url: `enrollments/${slug}/`,
        method: "GET",
      }),
    }),

    // Get section-specific course progress
    GetCourseSectionProgress: builder.query({
      query: ({ courseSlug, sectionId }) => ({
        url: `enrollments/${courseSlug}/section/${sectionId}/`,
        method: "GET",
      }),
    }),

    // (Optional) Mark a section as completed
    MarkSectionAsCompleted: builder.mutation({
      query: ({ courseSlug, sectionId }) => ({
        url: `enrollments/${courseSlug}/section/${sectionId}/complete/`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoadMyEnrollmentsQuery,
  useGetEnrolledCourseDetailQuery,
  useGetCourseSectionProgressQuery,
  useMarkSectionAsCompletedMutation,
} = enrollmentApi;
