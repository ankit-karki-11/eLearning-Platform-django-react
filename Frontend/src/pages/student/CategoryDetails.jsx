import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoadCategoryQuery } from '@/features/api/categoryApi'
import { Clock, File, FileArchiveIcon, Play, Star, Users, BookOpen, Award, Check, Globe, ChevronRight, BarChart2, HelpCircle, Shield, BadgeCheck, User, Calendar, Target, Download, ArrowBigDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoadUserQuery } from '@/features/api/authApi'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'


const CategoryDetails = () => {
    const { slug } = useParams()
    const { data, isLoading, error } = useLoadCategoryQuery()
    // const { data: user, isLoading: isLoadingUser, refetch } = useLoadUserQuery();
    const navigate = useNavigate();

    // Loading state
    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900 mx-auto"></div>
                <p className="text-gray-600">Loading category details...</p>
            </div>
        </div>
    )

    // Error state
    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-6 max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Failed to load category</h2>
                <p className="text-gray-600 mb-4">We couldn't load the category details. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        </div>
    )

    const category = data?.find(c => c.slug === slug)

    // Course not found state
    if (!category) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-6 max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Category Not Found</h2>
                <p className="text-gray-600 mb-4">The Category you're looking for doesn't exist or may have been removed.</p>
                {/* <Button onClick={() => navigate('/category')}>Browse Category</Button> */}
            </div>
        </div>
    )



    return (
        <div className="min-h-screen mt-14">

            <div className="bg-gray-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Course Info - 2 columns */}
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {category.title}
                            </h1>

                        </div>
                  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryDetails