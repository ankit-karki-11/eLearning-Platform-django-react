import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ENROLLMENT_API = "http://localhost:8000/api/v1/main/";

// create API slice
export const adminEnrollmentApi = createApi({
    reducerPath: "adminEnrollmentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ENROLLMENT_API,
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
        // add Enrollment
        createEnrollment: builder.mutation({
            query: (enrollmentData) => ({
                url: "enrollments/",
                method: "POST",
                body: enrollmentData,
               
            }),
        }),
        //loadEnrollment
        LoadEnrollment: builder.query({
            query: () => ({
                url: "enrollments/",
                method: "GET",

            }),
        }),
        getEnrollmentBySlug: builder.query({
            query: (slug) => ({
                url: `enrollments/${slug}/`,
                method: "GET",
            }),
        }),
        
        // updateEnrollment
        UpdateEnrollment: builder.mutation({
            query: ({ slug, data }) => ({
                url: `enrollments/${slug}/`,
                method: "PUT",
                body: data,

            }),

        }),
        DeleteEnrollment: builder.mutation({
            query: (id) => ({
                url: `enrollments/${id}/`,
                method: "DELETE",


            })

        }),
        
        // search Enrollments
        searchEnrollments: builder.query({
            query: ({ q, field = "both", sort = "" }) => {
                const params = new URLSearchParams();
                if (q.trim()) params.append("q", q.trim());
                if (field !== "both") params.append("field", field);
                if (sort) params.append("sort", sort);

                return {
                    url: `enrollments/search/?${params.toString()}`,
                    method: "GET",
                    // <<< override credentials only for this call
                    credentials: "omit",
                };
            },
        }),
    }),
})

export const {
    useCreateEnrollmentMutation,
    useLoadEnrollmentQuery,
    useUpdateEnrollmentMutation,
    useDeleteEnrollmentMutation,
    useSearchEnrollmentsQuery,
       // useGetEnrollmentByIdQuery,
    useGetEnrollmentBySlugQuery,
} = adminEnrollmentApi;
