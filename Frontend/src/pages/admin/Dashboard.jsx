import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useLoadCourseQuery } from '@/features/api/adminCourseApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { data: coursesData, isLoading, error } = useLoadCourseQuery();
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalSales: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (coursesData) {
      // Calculate stats from course data
      const totalCourses = coursesData.length;
      const totalStudents = coursesData.reduce((sum, course) => sum + (course.total_students || 0), 0);
      const totalSales = coursesData.reduce((sum, course) => sum + (course.price * (course.total_students || 0)), 0);
      const averageRating = coursesData.reduce((sum, course) => sum + (course.average_rating || 0), 0) / totalCourses || 0;

      setStats({
        totalCourses,
        totalStudents,
        totalSales,
        averageRating: averageRating.toFixed(1)
      });
    }
  }, [coursesData]);

  // Prepare data for the course uploads vs enrollments chart
  const prepareCourseEnrollmentData = () => {
    if (!coursesData || coursesData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Sort courses by creation date
    const sortedCourses = [...coursesData].sort((a, b) =>
      new Date(a.created_at) - new Date(b.created_at)
    );

    // Extract dates and cumulative values
    const labels = [];
    const cumulativeUploads = [];
    const cumulativeEnrollments = [];

    let totalUploads = 0;
    let totalEnrollments = 0;

    sortedCourses.forEach(course => {
      const date = new Date(course.created_at).toLocaleDateString();
      labels.push(date);

      totalUploads += 1;
      cumulativeUploads.push(totalUploads);

      totalEnrollments += course.total_students || 0;
      cumulativeEnrollments.push(totalEnrollments);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Courses Uploaded',
          data: cumulativeUploads,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3,
          fill: false,
        },
        {
          label: 'Cumulative Enrollments',
          data: cumulativeEnrollments,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.3,
          fill: false,
        }
      ]
    };
  };
  // Doughnut chart for course levels
  const courseLevelsData = {
    labels: ['Beginner', 'Intermediate', 'Advanced'],
    datasets: [
      {
        label: 'Courses by Level',
        data: [
          coursesData?.filter(course => course.level === 'beginner').length || 0,
          coursesData?.filter(course => course.level === 'intermediate').length || 0,
          coursesData?.filter(course => course.level === 'advanced').length || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const courseEnrollmentData = prepareCourseEnrollmentData();

  const enrollmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Timeline'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Count'
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (isLoading) return <div className="p-6 mt-12">Loading dashboard...</div>;
  if (error) return <div className="p-6 mt-12">Error loading dashboard data</div>;

  return (
    <div className="p-4 lg:p-6 mt-12 lg:ml-0">
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-gray-800'>Dashboard</h1>
        <p className='text-gray-600 mt-1'>Overview of the admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 mr-4">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <h3 className="text-2xl font-bold">{stats.totalCourses}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 mr-4">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 mr-4">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <h3 className="text-2xl font-bold">Rs {stats.totalSales}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-100 mr-4">
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <h3 className="text-2xl font-bold">{stats.averageRating}/5</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Course Uploads vs Enrollments Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">Course Uploads vs Enrollments</h3>
          </div>
          <div className="h-64">
            <Line data={courseEnrollmentData} options={enrollmentChartOptions} />
          </div>
        </div>
      </div>
      {/* Course Levels Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <BarChart3 size={20} className="text-purple-600 mr-2" />
          <h3 className="text-lg font-medium">Courses by Level</h3>
        </div>
        <div className="h-64 mx-auto" style={{ maxWidth: '400px' }}>
          <Doughnut data={courseLevelsData} options={chartOptions} />
        </div>
      </div>
      {/* Recent Courses Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Recent Courses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coursesData?.slice(0, 5).map((course) => (
                <tr key={course.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.level}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.total_students || 0}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.average_rating || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;