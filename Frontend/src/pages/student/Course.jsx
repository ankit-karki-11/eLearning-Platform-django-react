import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Course = ({ course }) => {
  const navigate = useNavigate();
  
  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all w-full flex flex-col">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden group">
        <img
          src={course.thumbnail || "course1.png"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-md text-xs font-semibold">
          {course.level}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold text-base line-clamp-2 dark:text-white mb-2">
          {course.title}
        </h3>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{course.course_duration} hrs</span>
          </div>
          <div className="text-lg font-bold dark:text-white">रु {course.price}</div>
        </div>
      </div>

      {/* btns */}
      <div className="px-4 pb-4 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 p-0"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          className="h-9 px-4 text-sm font-medium gap-1.5"
          onClick={() => navigate(`courses/course-detail/${course.slug}`)}
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Course