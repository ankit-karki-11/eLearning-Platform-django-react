import React from 'react'

const Dashboard = () => {
  const stats = [
    { title: 'Total Courses', value: '20', color: 'bg-blue-50 border-blue-200' },
    { title: 'Total Students', value: '5', color: 'bg-green-50 border-green-200' },
    { title: 'Total Sales', value: 'Rs 100', color: 'bg-purple-50 border-purple-200' }
  ]

  return (
    <div className='p-6 mt-12'>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-gray-800'>Dashboard</h1>
        <p className='text-gray-600 mt-1'>Overview of your admin panel</p>
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`${stat.color} border rounded-lg p-6 transition-transform hover:scale-105`}
          >
            <h3 className='text-sm font-medium text-gray-600 mb-2'>{stat.title}</h3>
            <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard