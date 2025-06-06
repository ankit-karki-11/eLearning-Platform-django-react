import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSEPROGRESS_API = "http://localhost:8000/api/v1/main/";


// create API slice
export const CourseProgressApi = createApi({
    reducerPath: "CourseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSEPROGRESS_API,
        credentials: 'include'
    }),

    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (id) => ({
                url: `CourseProgress/${id}`,
                method: "GET",
                // body:{Title,category}
            }),
        }),

        updateCourseProgress: builder.mutation({
            query: (courseid, sectionid, data) => ({
                url: `updateCourseProgress/${data.id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        completeCourse: builder.mutation({
            query: (courseid) => ({
                url: `updateCourseProgress/${data.id}/complete`,
                method: 'POST',
                body: data,

            }),

        }),

        incompleteCourse: builder.mutation({
            query: (courseid) => ({
                url: `updateCourseProgress/${data.id}/incomplete`,
                method: 'POST',
              

            }),

        }),

    }),
  })

  export const { 
    useGetCourseProgressQuery, 
    useUpdateCourseProgressMutation, 
    useCompleteCourseMutation, 
    useIncompleteCourseMutation } = CourseProgressApi;
