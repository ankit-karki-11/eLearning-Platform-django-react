import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSE_API = "http://localhost:8000/api/v1/main/";

// create API slice
export const adminCourseApi = createApi({
    reducerPath: "adminCourseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // create endpoints:
    endpoints: (builder) => ({
        // add course
        createCourse: builder.mutation({
            query: (courseData) => ({
                url: "course/",
                method: "POST",
                body: courseData,
               
            }),
        }),
        //loadcourse
        LoadCourse: builder.query({
            query: () => ({
                url: "course/",
                method: "GET",

            }),
        }),
        getCourseBySlug: builder.query({
            query: (slug) => ({
                url: `course/${slug}/`,
                method: "GET",
            }),
        }),
        
        // updatecourse
        UpdateCourse: builder.mutation({
            query: ({ slug, data }) => ({
                url: `course/${slug}/`,
                method: "PUT",
                body: data,

            }),

        }),
        DeleteCourse: builder.mutation({
            query: (id) => ({
                url: `course/${id}/`,
                method: "DELETE",


            })

        }),
        //  Get sections by course slug
        GetSectionsByCourse: builder.query({
            query: (courseSlug) => ({
                url: `course/${courseSlug}/sections/`,
                method: "GET",
            }),
        }),

        //loadcourse
        LoadSection: builder.query({
            query: () => ({
                url: "section/",
                method: "GET",

            }),
        }),

        // create Section
        CreateSection: builder.mutation({
            query: (sectionData) => ({
                url: "section/",
                method: "POST",
                body: sectionData,

            }),
        }),


        UpdateSection: builder.mutation({
            query: ({ id, data }) => ({
                url: `section/${id}/`,
                method: "POST",
                body: data,

            }),

        }),
        DeleteSection: builder.mutation({
            query: (id) => ({
                url: `section/${id}/`,
                method: "DELETE",


            })

        }),
        publishCourse: builder.mutation({
            query: (slug) => ({  // Changed from courseSlug to slug
                url: `course/${slug}/publish/`,
                method: 'POST',
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
    useCreateCourseMutation,
    useLoadCourseQuery,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetSectionsByCourseQuery,
    useSearchCoursesQuery,
    useLoadSectionQuery,
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    usePublishCourseMutation,
    useGetCourseByIdQuery,
    useGetCourseBySlugQuery,
} = adminCourseApi;
