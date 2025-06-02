import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },

    }),
    endpoints: (builder) => ({
        CreateKhaltiPayment: builder.mutation({
            query: (body) => ({
                url: 'payments/initiate_khalti_payment/',
                method: 'POST',
                body,

            })

        }),
        CompleteKhaltiPayment: builder.mutation({
            query: (body) => ({
                url: 'payments/complete_payment/',
                method: 'PATCH',
                body,

            })

        }),
        VerifyKhaltiPayment: builder.mutation({
            query: (body) => ({
                url: 'payments/verify_khalti_payment/',
                method: 'POST',
                body,

            })

        }),
    })
})

export const {
    useCreateKhaltiPaymentMutation,
    useCompleteKhaltiPaymentMutation,
    useVerifyKhaltiPaymentMutation
} = paymentApi