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
import { useLoadEnrollmentQuery, useDeleteEnrollmentMutation } from '@/features/api/adminEnrollmentApi';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const EnrollmentTable = () => {
  const navigate = useNavigate();
  const { data: enrollments = [], isLoading, refetch } = useLoadEnrollmentQuery();
  const [deleteEnrollment, { isLoading: isDeleting }] = useDeleteEnrollmentMutation();

  const handleDeleteEnrollment = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await deleteEnrollment(id).unwrap();
        refetch(); // refresh after deletion
      } catch (err) {
        console.error("Failed to delete enrollment:", err);
      }
    }
  };

  return (
    <div className="w-full px-3 py-14">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Enrollments</h2>
        <Button
          onClick={() => navigate('add')}
          size="sm"
          className="h-8 px-3 text-xs cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 inline-block" /> Add New Enrollment
        </Button>
      </div>

      <Table className="text-xs border">
        <TableCaption className="text-[11px] text-muted-foreground mb-2">
          List of recent course enrollments.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-2 py-1">Id</TableHead>
            <TableHead className="px-2 py-1">User</TableHead>
            <TableHead className="px-2 py-1">Course</TableHead>
            <TableHead className="px-2 py-1">Status</TableHead>
            <TableHead className="px-2 py-1">Progress</TableHead>
            <TableHead className="px-2 py-1 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-3">
                Loading...
              </TableCell>
            </TableRow>
          ) : enrollments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-3">
                No enrollments found.
              </TableCell>
            </TableRow>
          ) : (
            enrollments.map((enrollment) => (
              <TableRow key={enrollment.id} className="hover:bg-muted/50">
                <TableCell className="px-2 py-1">{enrollment.id}</TableCell>
                <TableCell className="px-2 py-1">
                  {/* {enrollment.user?.full_name || "N/A"} */}
                  {enrollment.student?.full_name || "N/A"}
                </TableCell>
                <TableCell className="px-2 py-1">
                  {enrollment.course?.title || "N/A"}
                </TableCell>
                <TableCell className="px-2 py-1">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      enrollment.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : enrollment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : enrollment.status === "certified"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </TableCell>
                <TableCell className="px-2 py-1">
                  {enrollment.progress ? `${enrollment.progress}%` : "0%"}
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
                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                    disabled={isDeleting}
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
            <TableCell colSpan={6} className="text-right text-[11px] text-muted-foreground py-1">
              Total: {enrollments.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default EnrollmentTable;
