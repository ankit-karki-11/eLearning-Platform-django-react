import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Dashboard = () => {
  return (
    <div >
         <div className='grid grid-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-16 gap-2'>
         <Card className='p-4'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>Total Courses</CardTitle>
            <h2>2</h2>
          </CardHeader>
         </Card>
         <Card className='p-4 gap-4'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>Total Students</CardTitle>
            <h2>5</h2>
          </CardHeader>
         </Card>
         <Card className='p-4 gap-4'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>Total Sales</CardTitle>
            <h2>Rs100</h2>
          </CardHeader>
         </Card>

        </div>
      
    </div>
  )
}

export default Dashboard
