import { Button } from '@/components/ui/button';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useLoadCourseQuery } from '@/features/api/adminCourseApi';
import { Delete, Edit, Edit2, PlusCircle, Ticket, Trash2 } from 'lucide-react';


const CourseTable = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading,refetch  } = useLoadCourseQuery();

  return (
    <div className="w-full px-3 py-14">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Courses</h2>
        <Button onClick={() => navigate('add')} size="sm" className="h-8 px-3 text-xs cursor-pointer">
          <PlusCircle className="h-4 w-4 inline-block" /> Add New Course
        </Button>
      </div>

      <Table className="text-xs border">
        <TableCaption className="text-[11px] text-muted-foreground mb-2">
          List of your recent courses.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-2 py-1">Id</TableHead>
            <TableHead className="px-2 py-1">Title</TableHead>
            <TableHead className="px-2 py-1">Price</TableHead>
            <TableHead className="px-2 py-1">Total Enrolled</TableHead>
            <TableHead className="px-2 py-1">Published</TableHead>
            <TableHead className="px-2 py-1 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-3">
                Loading...
              </TableCell>
            </TableRow>
          ) : courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-3">
                No courses found.
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/50">
                <TableCell className="px-2 py-1">{course.id}</TableCell>
                <TableCell className="px-2 py-1">{course.title}</TableCell>
                <TableCell className="px-2 py-1">Rs{course.price}</TableCell>
                <TableCell className="px-2 py-1"> {course.total_enrolled}</TableCell>
                <TableCell className="px-2 py-1">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${course.is_published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {course.is_published ? "True" : "False"}
                  </span>
                </TableCell>
               <TableCell className="px-2 py-1 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-blue-500 text-xs cursor-pointer"
                    onClick={() => navigate(`/admin/courses/${course.slug}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-red-500 text-xs cursor-pointer"
                    onClick={() => handleDeleteCourse(course.id)}
                    // disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right text-[11px] text-muted-foreground py-1">
              Total: {courses.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CourseTable;
