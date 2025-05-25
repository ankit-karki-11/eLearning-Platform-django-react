import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { Clock, File, FileArchiveIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoadUserQuery } from '@/features/api/authApi'
import { toast } from 'sonner'

const Coursedetails = () => {
    const { slug } = useParams()
    const { data, isLoading, error } = useLoadCourseQuery()
    const { data: user, isLoading: isLoadinguser, refetch } = useLoadUserQuery();
    const navigate = useNavigate();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading course</div>

    const course = data?.find(c => c.slug === slug)
    if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found</div>

    const handleBuyNow = () => {
        if (user) {
            navigate(`/payment/${course.slug}`)
        }
        else {
            navigate(`/login?redirect=/payment/${course.slug}`)
        }

    }
    return (
        <div className="px-12 min-h-screen mt-14 bg-gray rounded-2xl">
            <div className="bg-gray-250">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <img
                            src={course.thumbnail || "/course1.png"}
                            alt="Course thumbnail"
                            className="w-80 h-50 object-cover rounded-xl shadow-lg border-2 border-red"
                        />
                        <div className="text-black">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                            <div className="flex flex-wrap gap-3 items-center">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Level: {course.level}</span>
                                <span className="flex items-center gap-1 text-sm">
                                    <Clock className="h-3 w-3" />
                                    {course.course_duration} hours
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    <div className="flex-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Course Description</h2>
                            <p className="text-gray-600 leading-relaxed">{course.description}</p>
                        </div>

                       
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">What You'll Learn</h3>
                            <div className="grid gap-3">
                                {[/* course features */].map((feature, index) => (
                                    <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <svg className="flex-shrink-0 w-5 h-5 text-green-500 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* course section */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Course Section</h2>
                            <p className="text-gray-600 leading-relaxed">Introduction to ReactJS</p>
                            <p className="text-gray-600 leading-relaxed">Roadmap to ReactJS</p>
                            <p className="text-gray-600 leading-relaxed">Ideas and Tips for frontend</p>
                            <p className="text-gray-600 leading-relaxed">End of Course.</p>

                        </div>
                    </div>

                    
                    <div className="lg:w-96 w-full">
                        <div className="sticky top-20 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <div className="mb-6">
                                <p className="text-4xl font-bold text-gray-900 mb-2">
                                    रु {course.price}
                                </p>
                                <div className="text-gray-500 text-sm">One-time payment, Limited access</div>
                            </div>
                            {isLoadinguser ? null : (
                                <Button onClick={handleBuyNow}>
                                    Buy Now
                                </Button>
                            )}


                            <div className="mt-6 grid gap-3 text-sm text-gray-600">

                                <div className="flex items-center gap-2">
                                    <FileArchiveIcon></FileArchiveIcon>
                                    Certificate of completion
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Coursedetails