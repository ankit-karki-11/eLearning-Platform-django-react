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
            <Courses />
            
           
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
        path:"my-profile",
        element:  <Profile />,
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
