import { ChartArea, SquareLibrary, User, User2 } from 'lucide-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='hidden lg:block w-[200px] sm:w-[200px] space-y-8 bg-[#f0f0f0] p-5 sticky top-0 h-screen border-gray-300 dark:border-gray-800 my-14'>
            <div className=' space-y-2 text-sm '>
                <Link to="/admin" className='flex items-center gap-2'>
                    <ChartArea size={22} />
                    <h1>Dashboard</h1>
                </Link>
                <Link to="/admin/courses" className='flex items-center gap-2'>
                    <SquareLibrary size={22} />
                    <h1>Courses</h1>
                </Link>
                <Link to="/admin/courses" className='flex items-center gap-2'>
                    <User size={22} />
                    <h1>Students</h1>
                </Link>

        
            </div>

        </div>
    )
}

export default Sidebar
