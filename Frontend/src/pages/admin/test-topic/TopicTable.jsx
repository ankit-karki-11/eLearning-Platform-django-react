import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom';
import {
  useLoadCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} from '@/features/api/adminCategoryApi';
import { Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const TopicTable = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading, refetch } = useLoadCategoryQuery();

  // Add category state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [message, setMessage] = useState('');
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  // Edit category state
  const [editTitle, setEditTitle] = useState('');
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  // API mutations
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();


  // Handle create category
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required to create category.');
      return;
    }

    try {
      const res = await createCategory(title);
      toast.success('Category created successfully!');
      setSlug(res.slug);
      setTitle('');
      refetch();
    } catch (err) {
      toast.error('Failed to create category: ' + (err?.data?.error || 'Unknown error'));
    }
  };

  // Handle edit category
  const handleEditCategory = async () => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    try {
      await updateCategory({
        id: currentCategoryId,
        data: { title: editTitle }
      });
      toast.success('Category updated successfully!');
      refetch();
      setIsDialogOpen(false);
    } catch (err) {
      // toast.error('Failed to update category: ' + (err?.data?.error || 'Unknown error'));
    }
  };

  // Handle delete category
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this category?')) {
  //     try {
  //       await deleteCategory(id);
  //       toast.success('Category deleted successfully!');
  //       // Refresh the category list
  //       refetch();
  //     } catch (err) {
  //       toast.error(err.data?.message || 'Failed to delete category');
  //     }
  //   }
  // };



  return (
    <div className="w-full px-3 py-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
        <h2 className="text-sm font-semibold">Categories</h2>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 text-xs w-full md:w-64"
          />
          <Button
            onClick={handleCreate}
            size="sm"
            className="h-8 px-3 text-xs cursor-pointer"
            disabled={isCreating}
          >
            {isCreating ? 'Adding...' : '+ Add'}
          </Button>
        </div>
      </div>

      {message && <p className="text-sm text-red-500 mb-2">{message}</p>}
      {slug && (
        <div className="text-xs text-green-600 mb-2">
          <strong>Generated Slug:</strong> {slug}
        </div>
      )}

      <Table className="text-xs border">
        <TableCaption className="text-[11px] text-muted-foreground mb-2">
          List of your recent categories.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-2 py-1">Title</TableHead>
            <TableHead className="px-2 py-1">Slug</TableHead>
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
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-3">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/50">
                <TableCell className="px-2 py-1">{category.title}</TableCell>
                <TableCell className="px-2 py-1">{category.slug}</TableCell>

                <TableCell className="px-2 py-1 text-right space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-blue-500 text-xs cursor-pointer"
                        onClick={() => {
                          setEditTitle(category.title);
                          setCurrentCategoryId(category.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-xs">Edit Category</DialogTitle>
                        <DialogDescription className="text-xs">
                          Make changes to your category here.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Enter new category title"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                       
                        <Button
                          type="submit"
                          onClick={handleEditCategory}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Updating...' : 'Update'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right text-[11px] text-muted-foreground py-1">
              Total: {categories.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TopicTable;