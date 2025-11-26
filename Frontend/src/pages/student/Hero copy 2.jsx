import { Button } from '@/components/ui/button'
import { ArrowRightCircle, Compass, Expand, Fingerprint, Globe, Layers, Play, Rocket, Search, Sparkles } from 'lucide-react'
import { useGetCourseStatsQuery } from '@/features/api/courseApi'
import { useLoadUserQuery } from '@/features/api/authApi'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const Hero = () => {
  const { data: statsData, isLoading: statsLoading } = useGetCourseStatsQuery()
  const { data: userData, isLoading: userLoading } = useLoadUserQuery()
  const navigate = useNavigate()

  // State for animated counters
  const [counters, setCounters] = useState({
    enrollments: 0,
    courses: 0,
    success: 0
  })

  // State for fade-in animation
  const [isVisible, setIsVisible] = useState(false)

  // Actual values
  const totalEnrollments = statsData?.total_enrollments || 0
  const totalCourses = statsData?.total_courses || 0
  const successRate = 20 // Static value

  useEffect(() => {
    setIsVisible(true)

    if (!statsLoading && statsData) {
      const duration = 2000
      const startTime = Date.now()

      const animateCounters = () => {
        const progress = Math.min(1, (Date.now() - startTime) / duration)

        setCounters({
          enrollments: Math.floor(progress * totalEnrollments),
          courses: Math.floor(progress * totalCourses),
          success: Math.floor(progress * successRate)
        })

        if (progress < 1) {
          requestAnimationFrame(animateCounters)
        }
      }

      animateCounters()
    }
  }, [statsLoading, statsData, totalEnrollments, totalCourses])

  const handleExploreCourses = () => {
    navigate(`/courses`)
  }

  const handleStartTest = () => {
    navigate(`/practice/test`)
  }

  const handleMyCourses = () => {
    navigate(`/courses/my-learning`)
  }

  return (
    <div className='relative pt-24 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 overflow-hidden'>
      {/* Subtle grid pattern */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.05)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:20px_20px]"></div> */}
      {/* modern grid pattern */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div> */}

      <div className='relative max-w-3xl mx-auto text-center'>

        {/* === PERSONALIZED WELCOME FOR LOGGED-IN USERS === */}
        {userData && !userLoading && (
          <div className={`inline-flex items-center gap-2 font-medium px-4 py-2 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} shadow-sm shadow-blue-100/50 dark:shadow-blue-900/20`}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={userData.profile_image_url || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                {userData.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            Welcome back, <strong className="font-semibold">{userData.full_name.split(' ')[0]}</strong>!
            {/* <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 text-xs"> */}
            <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
              {userData.role}
            </Badge>
          </div>
        )}

        {/* === UNIVERSAL TAGLINE FOR GUESTS === */}
        {!userData && !userLoading && (
          <div className={`inline-flex items-center font-medium px-3 py-1.5 mb-6 rounded-full bg-white/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 text-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Sparkles className="mr-2 h-3 w-3 text-blue-500 dark:text-blue-400" />
            Easy learning for everyone
          </div>
        )}

        {/* Main Headline — Always Visible */}
        <h1 className={`text-4xl sm:text-5xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 transition-opacity duration-500 delay-100 uppercase ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          FOR NEXT GEN students
        </h1>

        {/* Subtitle — Always Visible */}
        <p className={`text-base text-gray-600 mb-8 max-w-xl mx-auto transition-opacity duration-500 delay-200 text-wrap ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          A modern learning platform built for next-gen students: explore curated courses, enroll anytime, practice with real tests, and master skills at your own pace all in one place.
        </p>

        {/* Primary CTA Buttons — Always Visible */}
        <div className={`mt-8 flex flex-col sm:flex-row justify-center gap-3 transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            onClick={handleExploreCourses}
            className="group px-6 py-5 text-sm font-medium rounded-lg bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white transition-all cursor-pointer hover:scale-100"
          >
            Explore Courses
            <Compass className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </Button>
          <Button
            onClick={handleStartTest}
            variant="outline"
            className="group px-6 py-5 text-sm font-medium rounded-lg border-black dark:border-gray-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900/50 cursor-pointer hover:scale-100"
          >
            Try Practice Test
            <Rocket className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Stats Grid — Always Visible */}
        <div className={`mt-8 grid grid-cols-3 gap-2 text-center text-gray-900 dark:text-gray-300 max-w-md mx-auto transition-opacity duration-500 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Enrollments */}
          {userData ? (
            <div
              onClick={handleMyCourses}
              className="p-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-3xl font-medium text-black">
                {statsLoading ? '0' : counters.enrollments.toLocaleString()}+
              </div>
              <div className="text-xs text-black dark:text-gray-400 mt-1 uppercase">Enrollments</div>
            </div>
          ) : (
            <div className="p-3 cursor-default opacity-80 hover:scale-100 transition-transform">
              <div className="text-3xl font-medium  text-black">
                {statsLoading ? '0' : counters.enrollments.toLocaleString()}+
              </div>
              <div className="text-xs text-black dark:text-gray-400 mt-1 uppercase">Enrollments</div>
            </div>
          )}

          {/* Courses */}
          {userData ? (
            <div
              onClick={handleExploreCourses}
              className="p-3 border-l border-r border-gray-200 dark:border-gray-800 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-3xl font-medium">
                {statsLoading ? '0' : counters.courses.toLocaleString()}
              </div>
              <div className="text-xs text-gray-900 dark:text-gray-400 mt-1">COURSES</div>
            </div>
          ) : (
            <div className="p-3 border-l border-r border-gray-200 dark:border-gray-800 cursor-default opacity-80 hover:scale-100 transition-transform">
              <div className="text-3xl font-medium">
                {statsLoading ? '0' : counters.courses.toLocaleString()}
              </div>
              <div className="text-xs text-gray-900 dark:text-gray-400 mt-1">COURSES</div>
            </div>
          )}

          {/* MCQ Tests Taken */}
          <div className="p-3 hover:scale-105 transition-transform">
            <div className="text-3xl font-medium">
              {statsLoading ? '0' : `${counters.success}+`}
            </div>
            <div className="text-xs text-gray-900 dark:text-gray-400 mt-1 uppercase">MCQ Tests Taken</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero