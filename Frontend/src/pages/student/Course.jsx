import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ArrowRight, Clock, ShoppingCart } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"

const Course = ({ course }) => {
  const navigate=useNavigate();
  return (
     <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
      {/* Course image with minimal overlay */}
      <div className="relative h-65 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent">
          <img
            // src='https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
            src={course.thumbnail || "course1.png"} 
            // src="/logo.png"
            alt="Modern Web Development course"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Minimal rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white backdrop-blur px-2 py-1 rounded">
          {/* <Star className="h-3 w-3 text-gray-200" /> */}
          <span className="text-xs font-medium bg-white text-black uppercase">{course.level}</span>
        </div>
      </div>

      {/* Course content */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 text-sm leading-snug">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          {/* <Avatar className="h-6 w-6 border border-gray-200 dark:border-gray-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs">RG</AvatarFallback>
          </Avatar> */}
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-gray-200 truncate">{course.description}</p>
            {/* <p className="text-xs text-gray-500 dark:text-gray-500">Google</p> */}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-m text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span> {course.course_duration} hrs</span>
          </div>
          <div className="text-xl text-gray-900 dark:text-gray-100">रु {course.price}</div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-3 pb-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
        <Button variant="ghost" size="m" className="p-2 h-8 w-8 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
          <ShoppingCart className="h-8 w-8" />
        </Button>
        <Button size="m" className="h-10 px-4 bg-gray-900 hover:bg-gray-800 text-white  dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white text-xs"
        onClick={() => navigate(`courses/course-detail/${course.slug}`)}

        >
          View Details
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export default Course
