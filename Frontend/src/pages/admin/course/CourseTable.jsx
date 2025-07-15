import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader, TableFooter,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'
import { useLoadCourseQuery } from '@/features/api/adminCourseApi'

const CourseTable = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useLoadCourseQuery();


  return (
    <div className='flex-1 mx-1 mt-14'>
      <Button onClick={() => navigate('add')} className='mb-4' variant='outline'>
        Add New Course
      </Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No courses found</TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.category.title}</TableCell>
                <TableCell>{course.is_published ? "Published" : "Not Published"}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Courses: {courses.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CourseTable;