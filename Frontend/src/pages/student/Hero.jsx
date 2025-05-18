import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import React from 'react'

const Hero = () => {
    return (
        <div className='relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 overflow-hidden'>
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-1/4 top-10 w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute right-1/4 top-40 w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute left-1/2 bottom-20 w-32 h-32 bg-pink-100 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className='relative max-w-7xl mx-auto text-center'>
                {/* Animated badge */}
                <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-900/50 dark:to-purple-900/50 text-blue-600 dark:text-blue-300 text-sm font-medium shadow-sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI-Powered Learning Platform
                </div>

                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6'>
                    Learn Smarter with {' '}
                    <span className="relative whitespace-nowrap text-blue-600 dark:text-blue-400">
                        <span className="relative">
                            AI-Powered
                            <svg className="absolute -bottom-2 left-0 h-4 w-full text-blue-800 dark:text-blue-600" viewBox="0 0 200 20">
                                <path
                                    d="M0 10 Q 50 18, 100 10 T 200 10"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                    </span>{' '}
                    Education
                </h1>

                <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Personalized learning paths powered by artificial intelligence to maximize your potential.
                    Our adaptive system tailors content to your unique learning style and pace.
                </p>

                <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
                    <Button className="group px-8 py-6 text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-lg">
                        <span>Start Learning</span>
                        <ArrowRight className="ml-2 h-5 w-5 transition-all group-hover:translate-x-1" />
                    </Button>
                    <Button variant="outline" className="px-8 py-6 text-lg font-medium rounded-lg border-2 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <span>Explore Courses</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                {/* Stats */}

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center dark:text-gray-300">
                    <div className="p-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">10K+</div>
                        <div className="text-gray-700 dark:text-gray-400">Students</div>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">500+</div>
                        <div className="text-gray-700 dark:text-gray-400">Courses</div>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">98%</div>
                        <div className="text-gray-700 dark:text-gray-400">Satisfaction</div>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">24/7</div>
                        <div className="text-gray-700 dark:text-gray-400">Support</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero