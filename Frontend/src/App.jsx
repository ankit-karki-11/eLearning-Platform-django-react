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

import Checkout from './pages/student/Checkout'
import PaymentSuccess from './pages/student/PaymentSuccess'

import Categories from './pages/student/Categories'
import CategoryDetails from './pages/student/CategoryDetails'
import CoursePlayer from './pages/student/CoursePlayer'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Hero />
            <Categories/>
            <Courses />
            <Checkout/>
           
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
        path:"category/:slug",
        element:  <CategoryDetails/>,
      }, 
      {
        path:"courses/course-detail/:slug",
        element:  <Coursedetails />,
      },
      {
        path:"checkout/:slug",
        element: <Checkout/>
      },
     {
        path:"course/:slug",
        element: <Course />
      },
      {
        path:"payment-success",
        element: <PaymentSuccess />
      },
       {
        path:"course/:slug/progress",
        element: <CoursePlayer />
      },
      
      
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
