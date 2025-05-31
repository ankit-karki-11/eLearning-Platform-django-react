import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSE_API = "http://localhost:8000/api/v1/main/";

import React from 'react'

// create API slice
export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: 'include'
    }),
    // create endpoints:
    endpoints: (builder) => ({
        // add course
        createCourse: builder.mutation({
            query: (title, category) => ({
                url: "course/",
                method: "POST",
                body: { title, category }
            }),
        }),
        //loadcourse
        LoadCourse: builder.query({
            query: () => ({
                url: "course/",
                method: "GET",
                // body:{Title,category}
            }),
        }),
        // updatecourse
        UpdateCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `course/${id}/`,
                method: "POST",
                body: data,
                // credentials:"include"
            }),

        }),
        DeleteCourse: builder.mutation({
            query: (id) => ({
                url: `course/${id}/`,
                method: "DELETE",
                // credentials:"include"

            })

        })

    })

})

export const {
    useCreateCourseMutation,
    useLoadCourseQuery,
    useUpdateCourseMutation,
    useDeleteCourseMutation
} = courseApi;
