import React from 'react'
import { useLoadUserQuery } from '@/features/api/authApi';
import { useLoadCourseQuery } from '@/features/api/courseApi';
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PaymentPage = () => {
  const {slug}=useParams();
  // load the courses
  // get={}
  const {data,isLoading,error,isSuccess}=useLoadCourseQuery();
  const{data:user,isLoading:userLoading,isSuccess:userSuccess,error:userError}=useLoadUserQuery();

  if(isLoading || userLoading)
    return <p>Loading your course.....</p>

  if(error)
    return <p>Error Loading your course</p>
    

  const course = data?.find(c => c.slug === slug)
  if (! course)
    return <p> Course not found </p>

  const handlePayment = () => {
    //write esewa logic here
    toast.message("Payment gateway is developing")
  }
  return (
    <div className='max-w-xl mx-auto p-12 bg-gray-50 mt-24 shadow rounded-2xl' >
      <h1>Confirm Payment</h1>
      <p>{course.title}</p>
      <p>{course.price}</p>

      <Button onClick={handlePayment}>
        Proceed to Pay
      </Button>
    </div>
  )
}

export default PaymentPage