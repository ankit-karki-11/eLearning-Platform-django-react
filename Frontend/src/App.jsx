import { useState } from 'react'

import { Button } from './components/ui/button'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Hero from './pages/student/Hero'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'

import Course from './pages/student/Course'
import Coursedetails from './pages/student/Coursedetails'
import Payment from './pages/student/PaymentPage'
import PaymentSuccess from './pages/student/PaymentSuccess'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Hero />,
            <Courses />,
            <Payment/>
           
          </>

        ),

      },
      {
        path:"login",
        element: <Login />,
      },
       {
        path:"my-learning",
        element:  <MyLearning />,
      },
       {
        path:"profile",
        element:  <Profile />,
      },
       {
        path:"courses/course-detail/:slug",
        element:  <Coursedetails />,
      },
      {
        path:"payment/:slug",
        element: <Payment/>
      },
        {
          path:"/payment/success",
        element:<PaymentSuccess /> 
      }     
    ],
  },

])
function App() {

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App
