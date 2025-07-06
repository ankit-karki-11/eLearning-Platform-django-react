import { Button } from '@/components/ui/button'
import { Brain, Zap, Target, BarChart3, Sparkles } from 'lucide-react'

const Interviewpage = () => {
    const features = [
        {
            icon: <Brain className="w-4 h-4" />,
            title: "AI-Powered Questions",
            description: "Intelligent questions tailored to your level"
        },
        {
            icon: <Zap className="w-4 h-4" />,
            title: "Instant Feedback",
            description: "Real-time analysis and improvement tips"
        },
        {
            icon: <Target className="w-4 h-4" />,
            title: "Skill Assessment",
            description: "Comprehensive evaluation of your performance"
        },
        {
            icon: <BarChart3 className="w-4 h-4" />,
            title: "Progress Tracking",
            description: "Monitor your improvement over time"
        }
    ]

    return (
        <div className="min-h-screen bg-white mt-16">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-gray-50 border text-gray-600 text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Powered by AI
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 max-w-2xl mx-auto leading-tight">
                    Practice Interviews with AI
                </h1>

                <p className="text-sm text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                    Get ready for your next interview with our AI-powered mock interview platform. 
                    Practice real questions and receive instant, personalized feedback.
                </p>

                <div className="flex justify-center gap-3">
                    <Button className="px-6 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800">
                        Start Practice
                    </Button>
                    <Button variant="outline" className="px-6 py-2 text-sm font-medium">
                        Learn More
                    </Button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-5xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="p-5 rounded-lg border border-gray-100 bg-gray-50/30">
                            <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center mb-3 border">
                                <div className="text-gray-700">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="font-medium text-sm text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it Works */}
            <div className="max-w-4xl mx-auto px-6 pb-16">
                <div className="text-center mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">How it works</h2>
                    <p className="text-sm text-gray-600">Simple steps to improve your interview skills</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-sm font-semibold text-gray-700">1</span>
                        </div>
                        <h3 className="font-medium text-sm text-gray-900 mb-2">Choose Your Role</h3>
                        <p className="text-xs text-gray-600">Select the position you're interviewing for</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-sm font-semibold text-gray-700">2</span>
                        </div>
                        <h3 className="font-medium text-sm text-gray-900 mb-2">Practice Interview</h3>
                        <p className="text-xs text-gray-600">Answer AI-generated questions in real-time</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-sm font-semibold text-gray-700">3</span>
                        </div>
                        <h3 className="font-medium text-sm text-gray-900 mb-2">Get Feedback</h3>
                        <p className="text-xs text-gray-600">Receive detailed analysis and improvement tips</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 border-t">
                <div className="max-w-4xl mx-auto px-6 py-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to ace your next interview?</h2>
                    <p className="text-sm text-gray-600 mb-6">Start practicing today and build confidence with AI-powered feedback</p>
                    <Button className="px-8 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800">
                        Get Started Free
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Interviewpage