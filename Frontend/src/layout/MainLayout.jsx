import Navbar from '@/components/Navbar'
import Footer from '@/pages/student/Footer'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar/>

      <div>
        <Outlet/>
      
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout
