import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const CATEGORY_API = "http://localhost:8000/api/v1/main/";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: CATEGORY_API,
        // credentials: 'include'
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
                // body:{Title,category}
            }),
        }),
        // updatecategory
        UpdateCategory:builder.mutation({
             query: ({id,data}) => ({
                url: `category/${id}/`, 
                method: "POST",
                body:data,
                // credentials:"include"
            }),
        }),
        // delete category
        DeleteCateory:builder.mutation({
            query: (id) => ({
                url: `category/${id}/`,
                method: "DELETE",
                // credentials:"include"

        })

    })

})
});

export const { 
    useCreateCategoryMutation, 
    useLoadCategoryQuery, 
    useUpdateCategoryMutation, 
    useDeleteCateoryMutation 
} = categoryApi;
