import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const RECOMMENDATION_API = "http://localhost:8000/api/v1/main/";


export const recommendationApi = createApi({
    reducerPath: 'recommendationApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: RECOMMENDATION_API,
        credentials: 'include',
        // prepareHeaders: (headers) => {
        //     const token = localStorage.getItem('accessToken');
        //     if (token) {
        //         headers.set('Authorization', `Bearer ${token}`);
        //     }
        //     return headers;
        // },
    }),
    endpoints: (builder) => ({
        getRecommendedCourses: builder.query({
            query: (courseSlug) => ({
                url: `recommendations/?course=${courseSlug}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
   useGetRecommendedCoursesQuery,
} = recommendationApi;