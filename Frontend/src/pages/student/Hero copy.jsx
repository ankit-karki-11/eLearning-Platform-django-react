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
      {/* SaaS Trust Signals */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-6 items-center opacity-80 z-10">
        {/* Replace with real logos as needed */}
        <img src="/public/logo.png" alt="Company1" className="h-8 w-auto grayscale opacity-70" />
        <img src="/public/khalti-logo.png" alt="Company2" className="h-8 w-auto grayscale opacity-70" />
        <img src="/public/vite.svg" alt="Company3" className="h-8 w-auto grayscale opacity-70" />
      </div>

      <div className='relative max-w-3xl mx-auto text-center'>
        {/* Personalized Welcome for logged-in users */}
        {userData && !userLoading && (
          <div className={`inline-flex items-center gap-2 font-medium px-4 py-2 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} shadow-sm shadow-blue-100/50 dark:shadow-blue-900/20`}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={userData.profile_image_url || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                {userData.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            Welcome back, <strong className="font-semibold">{userData.full_name.split(' ')[0]}</strong>!
            <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
              {userData.role}
            </Badge>
          </div>
        )}

        {/* Universal Tagline for guests with value proposition */}
        {!userData && !userLoading && (
          <div className={`inline-flex items-center font-medium px-3 py-1.5 mb-6 rounded-full bg-white/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 text-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Sparkles className="mr-2 h-3 w-3 text-blue-500 dark:text-blue-400" />
            All-in-one SaaS platform for scalable online learning
          </div>
        )}

        {/* Main Headline */}
        <h1 className={`text-4xl sm:text-5xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 transition-opacity duration-500 delay-100 uppercase ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Empower Your Learning Journey
        </h1>

        {/* Subtitle with value prop */}
        <p className={`text-base text-gray-600 mb-8 max-w-xl mx-auto transition-opacity duration-500 delay-200 text-wrap ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Unlock your potential with a modern SaaS LMS: curated courses, real practice tests, analytics, and certification—all in one seamless platform.
        </p>

        {/* Primary CTA Buttons */}
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
          {/* Free Trial CTA for guests */}
          {!userData && !userLoading && (
            <Button
              onClick={() => navigate('/signup')}
              variant="secondary"
              className="group px-6 py-5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all cursor-pointer hover:scale-100"
            >
              Start Free Trial
              <ArrowRightCircle className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5" />
            </Button>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <Layers className="h-8 w-8 text-blue-500 mb-2" />
            <div className="font-semibold">Modular Courses</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Curated content for every skill level</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Fingerprint className="h-8 w-8 text-purple-500 mb-2" />
            <div className="font-semibold">Personalized Analytics</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Track progress and performance</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Globe className="h-8 w-8 text-green-500 mb-2" />
            <div className="font-semibold">Certification</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Earn certificates for completed courses</div>
          </div>
        </div>

        {/* Stats Grid */}
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