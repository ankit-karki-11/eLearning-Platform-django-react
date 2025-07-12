import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes'

import MainLayout from './layout/MainLayout'
import Login from './pages/Login'
import Hero from './pages/student/Hero'
import Courses from './pages/student/Courses'
import Categories from './pages/student/Categories'
import Coursedetails from './pages/student/Coursedetails'
import AllCourse from './pages/student/AllCourse'
import Course from './pages/student/Course'
import Interviewpage from './pages/student/Interviewpage'
import CategoryDetails from './pages/student/CategoryDetails'
import NotFound from './pages/NotFound'

import Unauthorized from './pages/Unauthorized'
// student role protected routes
import MyLearning from './pages/student/MyLearning'
import Certificate from './pages/student/Certificate'
import CoursePlayer from './pages/student/CoursePlayer'
import Checkout from './pages/student/Checkout'
import PaymentSuccess from './pages/student/PaymentSuccess'
import Profile from './pages/student/Profile'
import CourseSearch from './pages/student/CourseSearch'
import CreateTest from './pages/student/smarttest/CreateTest'
import TestAttemptPage from './pages/student/smarttest/TestAttemptPage'
import MyTestPage from './pages/student/smarttest/MyTestPage'
import TestResultPage from './pages/student/smarttest/TestResultPage'
// import TestSubmittedPage from './pages/student/smarttest/TestSubmittedPage'
// import UsersLoving from './pages/student/UsersLoving'

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
            <Courses />
            <Categories />

          </>

        ),

      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "authorized",
        element: <Unauthorized />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "category/:slug",
        element: <CategoryDetails />,
      },
      {
        path: "courses/course-detail/:slug",
        element: <Coursedetails />,
      },

      {
        path: "course/:slug",
        element: <Course />
      },
      {
        path: "courses/",
        element: <AllCourse />
      },
      {
        path: "mock-ai-interview",
        element: <Interviewpage />
      },
      {
        path: "courses/search",
        element: <CourseSearch />
      },



      //protected routrs for student role
      {
        element: <ProtectedRoutes allowedRoles={['student']} />,
        children: [
          {
            path: "courses/my-learning",
            element: <MyLearning />,
          },
          {
            path: "profile",
            element: <Profile />,
          },

          {
            path: "checkout/:slug",
            element: <Checkout />
          },


          {
            path: "payment-success",
            element: <PaymentSuccess />
          },
          {
            path: "course/:slug/progress",
            element: <CoursePlayer />
          },
          {
            path: "certificate/:slug/",
            element: <Certificate />
          },
          {
            path: "/smart-test/test",
            element: <CreateTest />
          },
          {
            path:"/test-attempts/test/:testId/attempt/:attemptId/start",
            element:<TestAttemptPage />
          },
          //  {
          //   path: "/test-attempts/:attemptId/submit",
          //   element:<TestSubmittedPage />
          // },
          {
            path: "/test-attempts/:attemptId/results",
            element: <TestResultPage />,
          },
          {
            path: "test-attempts/history",
            element: <MyTestPage />
          },
        ]
      },

      // protected admin routes
      {
        element: <ProtectedRoutes allowedRoles={['admin']} />,
        children: [
          // { path: 'admin/dashboard', element: <AdminDashboard /> },
        ],
      },
    ],
  },
]);
function App() {

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App
