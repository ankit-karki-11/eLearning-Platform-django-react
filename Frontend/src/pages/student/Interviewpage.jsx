import { Button } from '@/components/ui/button'
import { MessageSquare, Zap, ClipboardCheck, BarChart } from 'lucide-react'
import { Check, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Interviewpage = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Quick Practice",
            description: "10-minute simulated interviews"
        },
        {
            icon: <ClipboardCheck className="w-5 h-5" />,
            title: "Real Questions",
            description: "From actual company interviews"
        },
        {
            icon: <BarChart className="w-5 h-5" />,
            title: "Instant Feedback",
            description: "Detailed performance analysis"
        }
    ]

    return (
        <div className="min-h-screen bg-black dark:from-gray-950 dark:to-gray-900 rounded-4xl">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-24 text-center">
                <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    New Feature
                </div>

                <h1 className="text-4xl md:text-5xl lg-text-4xl font-bold text-white dark:text-white mb-6 max-w-2xl mx-auto uppercase">
                    Pracrice Real Interview
                    Get Real Feedback.
                </h1>

                <p className="text-x text-gray-200 dark:text-gray-400 mb-10 max-w-xl mx-auto">
                    Practice with realistic technical interviews and get instant feedback to improve.
                </p>

                <div className="flex justify-center gap-4">
                    <Button
                        // onClick={() => navigate('/interview')} 
                        className="px-8 py-6 text-base font-medium"
                        variant=""
                    // className="px-8 py-6 text-base font-medium"
                    >
                        Try Now
                    </Button>
                    <Button
                        variant="outline"
                        className="px-8 py-6 text-base font-medium"
                    >
                        How It Works
                    </Button>
                </div>
            </div>


            {/* Pricing Section */}
            <div className="container mx-auto px-6 pb-24">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Choose Your Access</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* For Existing Course Owners */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Course Owner Access</h3>
                                <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                                    BEST VALUE
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-gray-300 mb-4">If you've purchased any course:</p>
                                <div className="text-4xl font-bold text-white mb-2">FREE</div>
                                <p className="text-gray-400 text-sm">Unlock with your existing course</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-300">Full interview feature access</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-300">All question categories</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-300">Detailed feedback reports</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-gray-300">Life time access</span>
                                </div>
                            </div>

                            <Button
                                className="w-full py-6"
                                variant='outline'
                            //   onClick={() => navigate('/verify-course')} 
                            >
                                Verify Course Access
                            </Button>
                        </div>

                        {/* Standalone Purchase */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">Standalone Access</h3>

                            <div className="mb-8">
                                <p className="text-gray-300 mb-4">One-time payment for full access:</p>
                                <div className="text-4xl font-bold text-white mb-2">₹1,000</div>
                                <p className="text-gray-400 text-sm">One-time payment</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                                    <span className="text-gray-300">Full interview feature access</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                                    <span className="text-gray-300">All question categories</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                                    <span className="text-gray-300">Detailed feedback reports</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                                    <span className="text-gray-300">Life time access</span>
                                </div>
                            </div>

                            <Button
                                className="w-full py-6"
                                variant='outline'
                            //   onClick={() => navigate('/checkout')}
                            >
                                Purchase Now
                            </Button>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 mt-8 text-sm">
                        Need help deciding? <a href="#" className="text-blue-400 hover:underline">Contact support</a>
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="container mx-auto px-6 pb-24">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="mx-auto bg-white dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-medium text-lg text-gray-200 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Interviewpage