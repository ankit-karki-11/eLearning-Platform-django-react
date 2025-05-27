// src/features/api/paymentApi.js
import { api } from './api'

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/',
        method: 'POST',
        body: data
      })
    }),
    verifyEsewa: builder.mutation({
      query: (data) => ({
        url: '/payments/verify-esewa/',
        method: 'POST',
        body: data
      })
    }),
    retryEsewa: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/retry-esewa/`,
        method: 'POST'
      })
    }),
  })
})

export const {
  useCreatePaymentMutation,
  useVerifyEsewaMutation,
  useRetryEsewaMutation
} = paymentApi
