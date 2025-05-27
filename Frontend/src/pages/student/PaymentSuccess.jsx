import React from 'react'
import { useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const transaction_uuid = searchParams.get("oid")
  const ref_id = searchParams.get("refId")

  // Optional: Call backend to verify payment using these params

  return (
    <div className="text-center mt-32">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful</h1>
      <p className="mt-2 text-gray-600">Thank you for your purchase!</p>
    </div>
  )
}

export default PaymentSuccess
