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
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from "@/components/ui/checkbox"

// create course API
import { useCreateCourseMutation } from '@/features/api/adminCourseApi'
// this load course.level and categories from the API
import {useLoadCategoryQuery} from '@/features/api/adminCategoryApi';
import { useLoadCourseQuery } from '@/features/api/adminCourseApi';

const AddCourse = () => {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [CourseTitle, setCourseTitle] = useState('');
  const [CourseCategory, setCourseCategory] = useState('');
  const [CourseKeywords, setCourseKeywords] = useState('');
  const [CourseDescription, setCourseDescription] = useState('');
  const [CoursePrice, setCoursePrice] = useState(0);
  const [CourseDuration, setCourseDuration] = useState(0);
  const [CourseLevel, setCourseLevel] = useState('');
  const [CourseRequirements, setCourseRequirements] = useState('');
  const [CourseLearningOutcomes, setCourseLearningOutcomes] = useState('');
  const [CourseSyllabus, setCourseSyllabus] = useState('');
  const [CourseThumbnail, setCourseThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const { data: categories = [] } = useLoadCategoryQuery();
  const { data: courses = [] } = useLoadCourseQuery();
  const LEVEL_CHOICES = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const getSelectedCategory = (value) => {
    setCourseCategory(value);
  };

  const createCourseHandler = async () => {
    if (!CourseTitle || !CourseCategory || !CourseDescription) {
      toast.error('Title, Category, and Description are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', CourseTitle);
    formData.append('category', CourseCategory);
    formData.append('keywords', CourseKeywords);
    formData.append('description', CourseDescription);
    formData.append('price', CoursePrice);
    formData.append('duration', CourseDuration);
    formData.append('level', CourseLevel);

    // Optional: convert multiline strings into JSON array
    formData.append('requirements', JSON.stringify(CourseRequirements.split('\n')));
    formData.append('learningOutcomes', JSON.stringify(CourseLearningOutcomes.split('\n')));
    formData.append('syllabus', JSON.stringify(CourseSyllabus.split('\n')));

    if (CourseThumbnail) {
      formData.append('thumbnail', CourseThumbnail);
    }

    formData.append('is_published', isPublished);

    try {
      await createCourse(formData).unwrap();
      toast.success('Course created successfully!');
      navigate('/admin/courses');
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error('Failed to create course. Please try again.');
    }
  };

  return (
    <div className='flex-1 mx-1 mt-14'>
      <div className='mb-4'>
        <h1 className='font-semibold text-sm'>Add New Course</h1>
      </div>

      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <Label>Title</Label>
          <Input
            value={CourseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Course Title"
            className='mb-2 border border-gray-100 rounded-md p-2'
          />
        </div>

        <div>
          <Label>Keywords</Label>
          <Input
            value={CourseKeywords}
            onChange={(e) => setCourseKeywords(e.target.value)}
            placeholder="html, css, js"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select value={CourseCategory} onValueChange={getSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
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

        <div>
          <Label>Level</Label>
          <Select value={CourseLevel} onValueChange={setCourseLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
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

        <div>
          <Label>Price (Rs)</Label>
          <Input
            type="number"
            value={CoursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            min="0"
            placeholder="e.g. 1000"
          />
        </div>

        <div>
          <Label>Duration (hours)</Label>
          <Input
            type="number"
            value={CourseDuration}
            onChange={(e) => setCourseDuration(e.target.value)}
            min="0"
            placeholder="e.g. 10"
          />
        </div>

        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea
            value={CourseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="Brief overview of the course"
          />
        </div>

         <div className="col-span-2">
          <Label>Requirements (one per line)</Label>
          <Textarea
            value={CourseRequirements}
            onChange={(e) => setCourseRequirements(e.target.value)}
            placeholder="Basic computer skills"
          />
        </div>

        <div className="col-span-2">
          <Label>Learning Outcomes (one per line)</Label>
          <Textarea
            value={CourseLearningOutcomes}
            onChange={(e) => setCourseLearningOutcomes(e.target.value)}
            placeholder="Understand HTML structure"
          />
        </div>

        <div className="col-span-2">
          <Label>Syllabus (one per line)</Label>
          <Textarea
            value={CourseSyllabus}
            onChange={(e) => setCourseSyllabus(e.target.value)}
            placeholder="Week 1: Introduction to HTML"
          />
        </div> 

        <div className="col-span-2">
          <Label>Thumbnail</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setCourseThumbnail(e.target.files[0])}
          />
        </div>

        <div className="space-y-1 flex items-center gap-2">
          <Checkbox
            checked={isPublished}
            onCheckedChange={(checked) => setIsPublished(checked)}
          />
          <Label>Publish this course</Label>
        </div>

        <div className='col-span-2 flex gap-4 mt-2'>
          <Button variant='outline' className='cursor-pointer' onClick={() => navigate("/admin/courses")}>Back</Button>
          <Button onClick={createCourseHandler} className='cursor-pointer' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
