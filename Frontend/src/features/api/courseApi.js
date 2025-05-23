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
        // createCourse:builder.mutation({
        //     query:(Title,category)=>({
        //         url:"/",
        //         method:"POST",
        //         body:{Title,category}
        //     })
        // }),

        LoadCourse: builder.query({
            query: () => ({
                url: "course/",
                method: "GET",
                // body:{Title,category}
            })
        })

    })

})

export const {
    // useCreateCourseMutation,
    useLoadCourseQuery
} = courseApi;
