import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

import { useNavigate } from 'react-router-dom'


const Hero = () => {
  const navigate = useNavigate();
  
  const handleExploreCourses = () => {
    navigate(`/course`);
  };

  return (
    <div className='relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 overflow-hidden'>
      <div className='relative max-w-3xl mx-auto text-center'>
        <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 text-xs font-mono tracking-wider">
          <Sparkles className="mr-2 h-3 w-3 text-blue-500 dark:text-blue-400" />
          AI-POWERED EDUCATION PLATFORM
        </div>

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-gray-900 dark:text-white mb-6 leading-tight'>
          Learn smarter with <br className="sm:hidden" />
          <span className="text-gray-600 ">AI-driven</span> precision
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Adaptive learning technology that evolves with your unique style and pace.
        </p>

        <div className='mt-8 flex flex-col sm:flex-row justify-center gap-3'>
          <Button
             onClick={handleExploreCourses}
              className="group px-5 py-6 text-sm font-sm rounded-lg bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white transition-all cursor-pointer">
            <span>Start learning</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </Button>
          <Button             
            onClick={handleExploreCourses}
              variant="outline" className="group px-5 py-6 text-sm font-sm rounded-lg border-gray-900 dark:border-gray-200 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer">
            <span>Explore courses</span>
          </Button> 
        </div>

        
        <div className="mt-12 grid grid-cols-3 gap-2 text-center text-gray-900 dark:text-gray-300 max-w-md mx-auto">
          <div className="p-3">
            <div className="text-2xl font-medium">20+</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">LEARNERS</div>
          </div>
          <div className="p-3 border-l border-r border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-medium">10+</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">COURSES</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-medium">98%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SUCCESS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero