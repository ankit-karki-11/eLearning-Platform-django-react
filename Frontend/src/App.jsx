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

import Sidebar from './pages/admin/Sidebar'
import AddCourse from './pages/admin/course/AddCourse'
// import AddSection from './pages/admin/section/AddSection'
import Dashboard from './pages/admin/Dashboard'
import AdminLayout from './layout/AdminLayout'
import CourseTable from './pages/admin/course/CourseTable'
import CategoryTable from './pages/admin/course/CategoryTable'
import AddCategory from './pages/admin/course/AddCategory'

import SectionTable from './pages/admin/section/SectionTable'
import AddSection from './pages/admin/section/AddSection'
import UpdateCourse from './pages/admin/course/UpdateCourse'
import TopicTable from './pages/admin/test-topic/TopicTable'
import TestTable from './pages/admin/test-topic/TestTable'

// enrollments
import EnrollmentTable from './pages/admin/enrollment/EnrollmentTable'
import StartTest from './pages/student/StartTest'
import MyLearningHero from './pages/student/MyLearningHero'
import LearningProcess from './pages/student/LearningProcess'
import TestAttempt from './pages/student/TestAttempt'
import CourseReviewsPage from './pages/student/CourseReviewsPage'
import Testimonials from './pages/student/Testimonials'
// import StartTest from './pages/student/smarttest/StartTest'
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
            {/* <Categories /> */}
            <MyLearningHero />
            <Courses />
            <Testimonials />
            <LearningProcess />

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

            path: "/practice/test",
            element: <CreateTest />
          },
          //   {
          //   path: "/smart-test/test",
          //   element: <CreateTest />
          // },
          {
            path: "/test-attempts/:attemptId/start",
            element: <TestAttemptPage />
          },
          {
            path: "/test-results/:attemptId",
            element: <TestResultPage />
          },
          {
            path: "/my-tests",
            element: <MyTestPage />
          },

          // for formal test
          {
            path: "/course/:slug/test",
            element: <StartTest />
          },
          {
            path: "//course/:slug/attempt/:id",
            element: <TestAttempt />
          },
          {
            path: "/course/:slug/reviews",
            element: <CourseReviewsPage />
          },
          // <Route path="/course/:slug/attempt/:id" element={<TestAttempt />} />

          //  <Route path="/course/:slug/start-test" element={<StartTest />} />
        ]
      },

      // protected admin routes
      {
        element: <ProtectedRoutes allowedRoles={['admin']} />,

        children: [
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              // {
              //   path: '',
              //   element: <Sidebar />
              // },
              {
                path: '',
                element: <Dashboard />
              },

              {
                path: 'courses/section',
                element: <AddSection />
              },
              {
                path: 'courses',
                element: <CourseTable />
              },
              {
                path: 'courses/add',
                element: <AddCourse />
              },
              {
                path: 'courses/:slug',
                element: <UpdateCourse />
              },
              {
                path: 'enrollments',
                element: <EnrollmentTable />
              },
              {
                path: 'courses/categories',
                element: <CategoryTable />
              },
              {
                path: 'courses/categories/add',
                element: <AddCategory />
              },
              {
                path: 'sections',
                element: <SectionTable />
              },
              {
                // AddSection
                // path: 'sections/add',
                path: 'sections/add',
                element: <AddSection />
              },

              //  {

              //   path: 'courses/${courseId}/sections/add',
              //   element: <AddSectionByCourse />
              // },
              // /admin/courses/${courseId}/sections/add

              // /admin/courses/${courseId}/sections

              // /admin/sections/edit/${sectionId}

              {
                path: 'tests/topics',
                element: <TopicTable />
              },
              {
                path: 'tests',
                element: <TestTable />
              },

            ],
          },
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
