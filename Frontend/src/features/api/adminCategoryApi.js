import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const CATEGORY_API = "http://localhost:8000/api/v1/main/";

export const adminCategoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: CATEGORY_API,
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
        // add category
        createCategory: builder.mutation({
            query: (title) => ({
                url: "category/",
                method: "POST",
                body: { title }
            }),
        }),
        //loadcategory
        LoadCategory: builder.query({
            query: () => ({
                url: "category/",
                method: "GET",

            }),
        }),
        // updatecategory
        UpdateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `category/${id}/update/`,
                method: "POST",
                body: data,

            }),
        }),
        // delete category
        //     DeleteCategory:builder.mutation({
        //         query: (id) => ({
        //             url: `category/${id}/`,
        //             method: "DELETE",


        //     })

        // })
        // deleteCategory: builder.mutation({
        //     query: (id) => ({
        //         url: `category/${id}/`,
        //         method: 'DELETE',
        //     }),
        //     transformErrorResponse: (response) => {
        //         // Standardize error responses
        //         return {
        //             status: response.status,
        //             data: {
        //                 detail: response.data?.detail || 'Deletion failed',
        //                 code: response.data?.code || 'unknown_error'
        //             }
        //         };
        //     }
        // }),

    })
});

export const {
    useCreateCategoryMutation,
    useLoadCategoryQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = adminCategoryApi;
