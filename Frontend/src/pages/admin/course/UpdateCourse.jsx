import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from '@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, BookOpen, List, FileText, Upload, CheckCircle2, Pencil, AlertTriangle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// API imports
import { useUpdateCourseMutation, useGetCourseBySlugQuery } from '@/features/api/adminCourseApi'
import { useLoadCategoryQuery } from '@/features/api/adminCategoryApi'

const CourseErrorBoundary = ({ error, slug, onRetry }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <h2 className="text-xl font-semibold">Course Not Found</h2>
      <p className="text-gray-600">
        No course found with slug: <code className="bg-gray-100 p-1 rounded">{slug}</code>
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
        <Button onClick={() => navigate('/admin/courses')}>
          Back to Courses List
        </Button>
      </div>
    </div>
  )
}

const UpdateCourse = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()

  // Fetch course by slug
  const { data: course, isLoading: isCourseLoading, error, refetch } = useGetCourseBySlugQuery(slug, {
    skip: !slug, // Skip if no slug
    refetchOnMountOrArgChange: true // Ensure fresh data
  });

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    keywords: '',
    description: '',
    price: 0,
    course_duration: 0,
    level: '',
    requirements: '',
    learningOutcomes: '',
    syllabus: '',
    is_published: false
  })
  const [CourseThumbnail, setCourseThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  // Load categories
  const { data: categories = [] } = useLoadCategoryQuery()
  const LEVEL_CHOICES = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

  // Populate form when course data loads
  useEffect(() => {
    if (course) {
      setFormData({
        title: course?.title || '',
        category_id: course?.category_id || '',
        keywords: course?.keywords || '',
        description: course?.description || '',
        price: course?.price || 0,
        course_duration: course?.course_duration || 0,
        level: course?.level || '',
        requirements: course?.requirements || 'No specific requirements', // Default from serializer
        learningOutcomes: course?.learning_outcomes || 'Students will learn the skills and knowledge related to this course', // Default from serializer
        syllabus: course?.syllabus || 'Syllabus will be provided in the course', // Default from serializer
        is_published: course?.is_published || false
      });

      if (course?.thumbnail) {
        setThumbnailPreview(course.thumbnail);
      }
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: Number(value) }))
  }

  const handleUpdateCourse = async () => {
    if (!formData.category_id || !formData.level) {
      toast.error('Category and Level are required.')
      return
    }

    const submitData = new FormData()
    submitData.append('title', formData.title)
    submitData.append('category_id', formData.category_id)
    submitData.append('keywords', formData.keywords)
    submitData.append('description', formData.description)
    submitData.append('price', formData.price)
    submitData.append('course_duration', formData.course_duration)
    submitData.append('level', formData.level)

    // Convert multiline strings to arrays
    submitData.append('requirements', JSON.stringify(formData.requirements.split('\n')))
    submitData.append('learningOutcomes', JSON.stringify(formData.learningOutcomes.split('\n')))
    submitData.append('syllabus', JSON.stringify(formData.syllabus.split('\n')))

    if (CourseThumbnail) {
      submitData.append('thumbnail', CourseThumbnail)
    }

    submitData.append('is_published', formData.is_published)

    try {
      await updateCourse({ slug, data: submitData }).unwrap()
      toast.success('Course updated successfully!')
      refetch() // Refresh the course data
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update course. Please try again.')
    }
  }

  if (isCourseLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <CourseErrorBoundary error={error} slug={slug} onRetry={refetch} />
  }
  // if (isLoading) {
  //   return <div className="flex justify-center items-center h-screen">
  //     <Loader2 className="h-8 w-8 animate-spin" />
  //   </div>;
  // }

  if (!course) {
    return <CourseErrorBoundary error={{ status: 404 }} slug={slug} onRetry={refetch} />
  }

  return (
    <div className='max-w-6xl mx-auto p-4 md:p-2 space-y-6 md:space-y-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 md:mt-12'>
        <h1 className='text-lg md:text-xl font-bold text-gray-900'>Update Course</h1>
        <div className='flex gap-2 w-full md:w-auto'>
          <Button
            variant={formData.is_published ? "default" : "outline"}
            size="sm"
            className={`h-8 px-3 text-xs flex items-center gap-2 w-full md:w-auto ${formData.is_published ? "bg-green-600 hover:bg-green-700" : "border-gray-300 hover:bg-gray-50"}`}
            onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
          >
            {formData.is_published ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Published</span>
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                <span>Not Published</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleUpdateCourse}
            disabled={isUpdating}
            size="sm"
            className="h-8 px-3 text-xs cursor-pointer w-full md:w-auto"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 inline-block" />
                <span className="hidden sm:inline">Update Course</span>
                <span className="sm:hidden">Update</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="flex w-full overflow-x-auto border-b text-xs">
          <TabsTrigger value="info" className="flex items-center gap-2 whitespace-nowrap">
            <BookOpen className="h-4 w-4" />
            <span>Course Info</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2 whitespace-nowrap">
            <List className="h-4 w-4" />
            <span>Course Content</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="info" className="space-y-4 md:space-y-6">
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
            {/* Left Column - Course Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base md:text-lg font-semibold">Course Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Title & Keywords */}
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <Label>Course Title</Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Web Development Bootcamp"
                      className="placeholder:text-xs md:placeholder:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Keywords</Label>
                    <Input
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="html, css, javascript"
                      className="placeholder:text-xs md:placeholder:text-sm"
                    />
                  </div>
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Difficulty Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVEL_CHOICES.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label>Description *</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Settings & Thumbnail */}
            <Card>
              <CardHeader className="md:hidden">
                <CardTitle className="text-base font-semibold">Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Thumbnail Upload with Preview */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Course Thumbnail
                  </Label>

                  <div className="flex flex-col items-start gap-4">
                    {/* Preview Area */}
                    <div className="w-full border rounded-lg overflow-hidden">
                      {CourseThumbnail ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(CourseThumbnail)}
                            alt="Course thumbnail preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      ) : thumbnailPreview ? (
                        <div className="relative">
                          <img
                            src={thumbnailPreview}
                            alt="Course thumbnail"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-50 border-2 border-dashed rounded-lg w-full h-32 flex flex-col items-center justify-center gap-2 text-gray-400">
                          <Upload className="h-6 w-6" />
                          <p className="text-xs">No thumbnail selected</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex gap-3 w-full">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                        size={"sm"}
                      >
                        <Label className="cursor-pointer flex items-center justify-center gap-2">
                          <Upload className="h-4 w-4" />
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCourseThumbnail(e.target.files[0])}
                            className="hidden"
                          />
                          {CourseThumbnail || thumbnailPreview ? "Change" : "Upload"}
                        </Label>
                      </Button>

                      {(CourseThumbnail || thumbnailPreview) && (
                        <Button
                          variant="destructive"
                          className="flex-1 cursor-pointer"
                          size={"sm"}
                          onClick={() => {
                            setCourseThumbnail(null)
                            setThumbnailPreview('')
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      Recommended: 1200×675 pixels (16:9), max 5MB
                    </p>
                  </div>
                </div>

                {/* Pricing and Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Price (Rs)</Label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleNumberInputChange}
                      min="0"
                      placeholder="0 for free"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Duration (hrs)</Label>
                    <Input
                      type="number"
                      name="course_duration"
                      value={formData.course_duration}
                      onChange={handleNumberInputChange}
                      min="0"
                      placeholder="Total hours"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Course Content Tab */}
        <TabsContent value="content" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <FileText className="h-5 w-5" />
                Course Structure
              </CardTitle>
              <CardDescription className="text-sm">
                Define what students will learn and how the course is organized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Prerequisites
                </Label>
                <Textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="What students should know before taking this course..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter one requirement per line
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Learning Outcomes
                </Label>
                <Textarea
                  name="learningOutcomes"
                  value={formData.learningOutcomes}
                  onChange={handleInputChange}
                  placeholder="What students will be able to do after completing this course..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  What students will achieve by the end
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Course Syllabus
                </Label>
                <Textarea
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  placeholder="Outline the course structure..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Outline modules and topics, one per line
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UpdateCourse