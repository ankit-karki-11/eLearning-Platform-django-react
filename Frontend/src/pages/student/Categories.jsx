import { useLoadCategoryQuery } from '@/features/api/categoryApi'
// import Course from './Course'
import { Skeleton } from '@/components/ui/skeleton'
import Category from './Category'

const Categories = () => {
  const { data, error, isLoading } = useLoadCategoryQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    )
  }
  if (error) {
    return <p>Error loading categories</p>
  }

  return (
    <div className="bg-gray-250">
      <div className="max-w-6xl mx-auto p-14">
        <h2 className="font-bold text-3xl text-left mb-8">Categories.</h2>

        {data?.length === 0 ? (
          <p className="text-center text-gray-600">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.map((category) => (
              <Category key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export default Categories

const CategorySkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}
    