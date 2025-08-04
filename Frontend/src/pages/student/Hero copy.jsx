import { Button } from '@/components/ui/button'
import { ArrowRightCircle, Sparkles } from 'lucide-react'
import { useGetCourseStatsQuery } from '@/features/api/courseApi'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Hero = () => {
  const { data, isLoading } = useGetCourseStatsQuery();
  const navigate = useNavigate();

  // State for animated counters
  const [counters, setCounters] = useState({
    enrollments: 0,
    courses: 0,
    success: 0
  });

  // State for fade-in animation
  const [isVisible, setIsVisible] = useState(false);

  // Actual values
  const totalEnrollments = data?.total_enrollments || 0;
  const totalCourses = data?.total_courses || 0;
  const successRate = 94; // Static value

  useEffect(() => {
    setIsVisible(true); // Trigger fade-in effect

    if (!isLoading && data) {
      // Simple counter animation
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animateCounters = () => {
        const progress = Math.min(1, (Date.now() - startTime) / duration);

        setCounters({
          enrollments: Math.floor(progress * totalEnrollments),
          courses: Math.floor(progress * totalCourses),
          success: Math.floor(progress * successRate)
        });

        if (progress < 1) {
          requestAnimationFrame(animateCounters);
        }
      };

      animateCounters();
    }
  }, [isLoading, data, totalEnrollments, totalCourses, successRate]);

  const handleExploreCourses = () => {
    navigate(`/courses`);
  };
  const handletrysmarttest = () => {
    navigate(`/smart-test/test`);
  };
  const handleMyCourses = () => {
    navigate(`/courses/my-learning`);
  };

  return (
    <div className='relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 overflow-hidden'>
      <div className='relative max-w-3xl mx-auto text-center'>
        <div className={`inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-gray-200 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 text-xs tracking-wider transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Sparkles className="mr-2 h-3 w-3 text-blue-500 dark:text-blue-400" />
          AI-POWERED EDUCATION PLATFORM
        </div>

        <h1 className={`text-3xl sm:text-4xl md:text-4xl font-medium tracking-tight text-gray-900 dark:text-white mb-6 transition-opacity duration-500 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Learn smarter with <br className="sm:hidden" />
          <span className="text-gray-600">AI</span>
        </h1>

        <p className={`text-sm text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed transition-opacity duration-500 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Adaptive learning technology that evolves with your pace.
        </p>

        <div className={`mt-8 flex flex-col sm:flex-row justify-center gap-3 transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            onClick={handleExploreCourses}
            className="group px-5 py-4 text-sm font-sm rounded-lg bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white transition-all cursor-pointer hover:scale-105"
          >
            <span>Explore courses</span>
            <ArrowRightCircle className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </Button>
          <Button
            onClick={handletrysmarttest}
            variant="outline"
            className="group px-5 py-4 text-sm font-sm rounded-lg border-gray-900 dark:border-gray-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900/50 cursor-pointer hover:scale-105"
          >
            <span>Try Smart Test</span>
            <ArrowRightCircle className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </Button>
        </div>

        <div className={`mt-12 grid grid-cols-3 gap-2 text-center text-gray-900 dark:text-gray-300 max-w-md mx-auto transition-opacity duration-500 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div
            onClick={handleMyCourses}
            className="p-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="text-3xl font-medium">
              {isLoading ? '0' : counters.enrollments.toLocaleString()}+
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Students Enrolled</div>
          </div>
          <div
            onClick={handleExploreCourses}
            className="p-3 border-l border-r border-gray-200 dark:border-gray-800 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="text-3xl font-medium">
              {isLoading ? '0' : counters.courses.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">COURSES</div>
          </div>
          <div className="p-3 hover:scale-105 transition-transform">
            <div className="text-3xl font-medium">
              {isLoading ? '0' : `${counters.success}%`}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SUCCESS RATE</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero