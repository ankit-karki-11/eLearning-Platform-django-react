import Navbar from '@/components/Navbar'
// import Coursedetails from '@/pages/student/Coursedetails'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar/>

      <div>
        <Outlet/>
      
      </div>
    </div>
  )
}

export default MainLayout
