import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useCreateCourseMutation } from '@/features/api/adminCourseApi'
import { toast } from 'sonner'

const AddCourse = () => {
  const navigate = useNavigate();
  // const isLoading = false;
  const [createCourse,{isLoading}] = useCreateCourseMutation();

  const [CourseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [slug, setSlug] = useState('');

  const getselectedCategory = (value) => {
    setCategory(value);
    // alert(`Selected Category: ${value}`);
  }
  const createCourseHandler = async() => {
    // Logic to handle course creation
    try{
      await createCourse({ title: CourseTitle, category, keywords, slug }).unwrap();
      navigate('/admin/courses');
      toast.success('Course created successfully!');

    }catch (error) {
      console.error("Error creating course:", error);
      toast.error('Failed to create course. Please try again.');
    }
  };

  return (
    <div className='flex-1 mx-1 mt-14'>
      <div className='mb-4'>
        <h1 className='font-simple text-sm'>
          Lets add new course
        </h1>

      </div>

      <div className='flex flex-col gap-4 space-y-4'>
        <div>
          <Label>Title</Label>
          <Input
            id="CourseTitle"
            value={CourseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full"
            type="text"
            name="CourseTitle"
            placeholder="Your Course Title"
          />
        </div>
         <div>
          <Label>Keywords</Label>
          <Input
            id="CourseKeywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-1/2"
            type="text"
            name="CourseKeywords"
            placeholder="Your Course Keywords"
          />
        </div>


        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={getselectedCategory}
           className="w-1/2">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Java Script">Java Script</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-4 '>
          <Button variant='outline' onClick={() => navigate("/admin/courses")} className='cursor-pointer'>Back</Button>
          <Button className='cursor-pointer'onClick={createCourseHandler} disabled={isLoading}>
            {
              isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span className='ml-2'>Loading...</span>

                </>
              ) :
                "Create Course"
            }
          </Button>
        </div>

      </div >
    </div >
  )
}

export default AddCourse
