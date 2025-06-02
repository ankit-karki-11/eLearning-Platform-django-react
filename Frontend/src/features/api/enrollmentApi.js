import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ENROLLMENT_API = "http://localhost:8000/api/v1/main/";

import React from 'react'

// create API slice
export const enrollmentApi = createApi({
    reducerPath: "enrollmentApi",
      baseQuery: fetchBaseQuery({
           baseUrl: ENROLLMENT_API,
           prepareHeaders: (headers) => {
               const token = localStorage.getItem('accessToken')
               if (token) {
                   headers.set('Authorization', `Bearer ${token}`)
               }
               return headers
           },
       }),
    // create endpoints:
    endpoints: (builder) => ({
        //LoadMyEnrollments
        LoadMyEnrollments: builder.query({
            query: () => ({
                url: "enrollments/",
                method: "GET",
                // body:{Title,category}
            }),
        }),
    })

})

export const {
   useLoadMyEnrollmentsQuery
} = enrollmentApi;
