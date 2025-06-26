import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = "http://localhost:8000/api/v1/main/";

export const certificateApi = createApi({
    reducerPath: "certificateApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE,
          prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
    endpoints: (builder) => ({
        // Generate certificate for completed course
        generateCertificate: builder.mutation({
            query: (courseSlug) => ({
                url: `certificates/generate/${courseSlug}/`,
                method: "POST"
            }),
            invalidatesTags: ['Certificate']
        }),

        // Get all certificates for current user
        getMyCertificates: builder.query({
            query: () => ({
                url: "certificates/",
                method: "GET"
            }),
            providesTags: ['Certificate']
        }),

        // Download certificate file
        downloadCertificate: builder.query({
            query: (certificateId) => ({
                url: `certificates/${certificateId}/download/`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        })
    })
})

export const {
    useGenerateCertificateMutation,
    useGetMyCertificatesQuery,
    useLazyDownloadCertificateQuery
} = certificateApi;