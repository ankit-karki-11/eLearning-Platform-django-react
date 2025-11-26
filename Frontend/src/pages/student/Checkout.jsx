import React from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, BadgeCheck, Combine, GalleryHorizontal } from 'lucide-react'
import { useLoadCourseQuery } from '@/features/api/courseApi'
import { useLoadUserQuery } from '@/features/api/authApi'
import { useCreateKhaltiPaymentMutation } from '@/features/api/paymentApi'

const Checkout = () => {
    const { slug } = useParams()
    const { data: courses, isLoading, error } = useLoadCourseQuery()
    const { data: user, isLoading: userLoading, error: userError } = useLoadUserQuery()
    const [initiate_khalti_payment, { isLoading: paymentLoading }] = useCreateKhaltiPaymentMutation()

    if (isLoading || userLoading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        )

    if (error || userError)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-lg font-medium">
                    Error loading course data. Please try again later.
                </p>
            </div>
        )

    const course = courses?.find(c => c.slug === slug)
    if (!course)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-lg font-medium">Course not found</p>
            </div>
        )

    const handlePayment = async () => {
        try {
            const res = await initiate_khalti_payment({
                course_id: course.id,
                amount: course.price * 100,
                purchase_order_id: course.slug,
                purchase_order_name: course.title,
                return_url: `${window.location.origin}/payment-success`,
            }).unwrap();
            toast.success("Payment initiated successfully")
            toast.success("Redirecting to Khalti...");
            window.location.href = res.payment_url
        } catch (error) {
            console.log(error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-10 px-4 mt-12">
            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Course Details */}
                    <div className="md:w-1/2 w-full p-8 border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="flex flex-col items-center mb-6">
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-100 h-60 object-cover rounded-sm mb-5 border border-gray-200"
                                />
                            ) : (
                                <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-sm mb-5 border border-gray-200">
                                    <BadgeCheck className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <h2 className="text-xl font-semibold text-center mb-2">{course.title}</h2>
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Course Details</h3>
                            <div className="space-y-2 text-sm">
                                {course.category && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span>{course.category.title}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Level:</span>
                                    <span>{course.level || "All Levels"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span>
                                        {course.course_duration
                                            ? `${parseFloat(course.course_duration) % 1 === 0
                                                ? parseInt(course.course_duration, 10)
                                                : course.course_duration
                                            } ${parseFloat(course.course_duration) === 1 ? "hr" : "hrs"}`
                                            : "Self-paced"}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Summary */}
                    <div className="md:w-1/2 w-full p-8 flex flex-col">
                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-black mb-3">
                                <GalleryHorizontal className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-semibold mb-1">Complete Your Enrollment</h1>
                            <p className="text-gray-600 text-sm">
                                Secure your access to <span className="font-medium">{course.title}</span>
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-sm p-5 mb-6">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Course Fee</span>
                                <span className="font-medium">Rs {course.price}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600">Discount</span>
                                <span className="font-medium">Rs 0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="font-semibold">Total Amount</span>
                                <span className="text-lg font-bold">Rs {course.price}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className="w-full py-3 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            {paymentLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                'Proceed to Payment'
                            )}
                        </Button>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Your payment is secure and encrypted. By completing this purchase, you agree to our <a href="/terms" className="underline hover:text-gray-700">Terms of Service</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout