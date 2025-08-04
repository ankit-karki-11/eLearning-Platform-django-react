import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSE_API = "http://localhost:8000/api/v1/main/";

import React from 'react'

// create API slice
export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        // credentials: "include",
        // prepareHeaders: (headers) => {
        //     const token = localStorage.getItem("accessToken");
        //     if (token) {
        //         headers.set("Authorization", `Bearer ${token}`);
        //     }
        //     return headers;
        // },
    }),
    // create endpoints:
    endpoints: (builder) => ({
        LoadCourse: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams(params).toString();
                return {
                    url: `course/?${queryParams}`,
                    method: "GET",
                };
            },
        }),

        //  Get sections by course slug
        GetSectionsByCourse: builder.query({
            query: (courseSlug) => ({
                url: `course/${courseSlug}/sections/`,
                method: "GET",
            }),
        }),
        getCourseStats: builder.query({
            query: () => ({
                url: `course/get_stats_public/`,
                method: "GET",
            }),
        }),

        // search courses

        searchCourses: builder.query({
            query: ({ q, field = "both", sort = "" }) => {
                const params = new URLSearchParams();
                if (q.trim()) params.append("q", q.trim());
                if (field !== "both") params.append("field", field);
                if (sort) params.append("sort", sort);

                return {
                    url: `courses/search/?${params.toString()}`,
                    method: "GET",
                    // <<< override credentials only for this call
                    credentials: "omit",
                };
            },
        }),
    }),
})

export const {

    useLoadCourseQuery,
    useGetCourseStatsQuery,
    useGetSectionsByCourseQuery,
    useSearchCoursesQuery,
} = courseApi;
