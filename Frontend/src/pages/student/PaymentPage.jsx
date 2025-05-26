import React from 'react'
import { useLoadUserQuery } from '@/features/api/authApi'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const PaymentPage = () => {
  const { slug } = useParams()
  const {
    data: courses,
    isLoading,
    error,
    isSuccess
  } = useLoadCourseQuery()
  const {
    data: user,
    isLoading: userLoading,
    isSuccess: userSuccess,
    error: userError
  } = useLoadUserQuery()

  if (isLoading || userLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )

  if (error || userError)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-500">
          Error loading course data. Please try again later.
        </p>
      </div>
    )

  const course = courses?.find(c => c.slug === slug)
  if (!course)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Course not found</p>
      </div>
    )

  const handlePayment = () => {
    // write esewa logic here
    toast.message("Payment gateway is under development")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-24 pb-12 px-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center">
              
              <h1 className="text-2xl font-bold text-gray-950 mb-2">
                Confirm Your Payment
              </h1>
            </div>

            <div className="space-y-6 mt-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-m font-semibold text-gray-900 mb-2">
                  {course.title}
                </h2>

              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-gray-600">Price</span>
                <span className="font-bold text-gray-900">
                  रु {course.price}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-gray-600">Discount</span>
                <span className="font-bold text-gray-900">रु 0.00</span>
              </div>

              <div className="flex justify-between items-center pb-6">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900">
                  रु {course.price}
                </span>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full py-6 text-lg font-medium bg-black hover:bg-gray-800 transition-colors"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your payment is secure and encrypted. By completing this purchase,
              you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage