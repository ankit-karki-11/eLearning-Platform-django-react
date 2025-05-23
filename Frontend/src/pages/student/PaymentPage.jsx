import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { useLoadUserQuery } from '@/features/api/authApi'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const PaymentPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useLoadCourseQuery()
  const { data: user, isLoading: userLoading } = useLoadUserQuery()

  if (isLoading || userLoading) return <p>Loading...</p>
  if (error) return <p>Error loading course</p>
  // if (!user) return navigate('/login')

  const course = data?.find(c => c.slug === slug)
  if (!course) return <p>Course not found</p>

  const handlePayment = () => {
    //write esewa or khalti logic here
    toast.message("Payment Gatewar adding part is developing ")
  }

  return (
    <div className="max-w-xl mx-auto mt-24 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>
      <div className='font-medium '>
        <p className="text-lg mb-2">Course: {course.title}</p>
        <p className="text-md mb-4 text-gray-600">Price: रु {course.price}</p>

        <Button className="w-full" onClick={handlePayment}>
          Proceed to Pay
        </Button>

      </div>

    </div>
  )
}

export default PaymentPage
