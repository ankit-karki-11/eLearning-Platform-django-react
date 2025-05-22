import { ChartArea, SquareLibrary } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='hidden lg:block w-[250px] sm:w-[300px] space-y-8 bg-[#f0f0f0] p-5 sticky top-0 h-screen border-gray-300 dark:border-gray-800'>
            <div className=' space-y-4'>
                <Link>
                    <ChartArea size={22} />
                    <h1>Dashboard</h1>
                </Link>
                <Link>
                    <SquareLibrary size={22} />
                    <h1>Course</h1>
                </Link>
            </div>

        </div>
    )
}

export default Sidebar
