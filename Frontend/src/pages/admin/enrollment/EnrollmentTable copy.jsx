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
import { useLoadEnrollmentQuery } from '@/features/api/adminEnrollmentApi';

import { Delete, Edit, Edit2, PlusCircle, Ticket, Trash2 } from 'lucide-react';


const EnrollmentTable = () => {
  const navigate = useNavigate();
  const { data: enrollments = [], isLoading,refetch  } = useLoadEnrollmentQuery();

  return (
    <div className="w-full px-3 py-14">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Enrollments</h2>
        <Button onClick={() => navigate('add')} size="sm" className="h-8 px-3 text-xs cursor-pointer">
          <PlusCircle className="h-4 w-4 inline-block" /> Add New Enrollment
        </Button>
      </div>

      <Table className="text-xs border">
        <TableCaption className="text-[11px] text-muted-foreground mb-2">
          List of recent Course enrollments.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-2 py-1">Id</TableHead>
            <TableHead className="px-2 py-1">Title</TableHead>
            {/* <TableHead className="px-2 py-1">Rating(Avg)</TableHead> */}
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
          ) : enrollments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-3">
                No enrollments found.
              </TableCell>
            </TableRow>
          ) : (
            enrollments.map((enrollment) => (
              <TableRow key={enrollment.id} className="hover:bg-muted/50">
                <TableCell className="px-2 py-1">{enrollment.id}</TableCell>
                {/* <TableCell className="px-2 py-1">{enrollment.title}</TableCell> */}
                {/* <TableCell className="px-2 py-1">{enrollment.average_rating}</TableCell> */}
                {/* <TableCell className="px-2 py-1">Rs{enrollment.price}</TableCell> */}
                {/* <TableCell className="px-2 py-1"> {enrollment.total_enrolled}</TableCell> */}
                <TableCell className="px-2 py-1">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${enrollment.is_published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {enrollment.is_published ? "True" : "False"}
                  </span>
                </TableCell>
               <TableCell className="px-2 py-1 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-blue-500 text-xs cursor-pointer"
                    onClick={() => navigate(`/admin/enrollments/${enrollment.slug}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-red-500 text-xs cursor-pointer"
                    onClick={() => handleDeleteenrollment(enrollment.id)}
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
              Total: {enrollments.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default EnrollmentTable;
