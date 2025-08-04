import React, { useState } from 'react';
import { useCreateCategoryMutation } from '@/features/api/adminCategoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AddCategory = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [message, setMessage] = useState('');
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage('Title is required.');
      return;
    }
    try {
      const res = await createCategory(title);
     
      toast.success('Category created successfully!');
      setSlug(res.slug); 
      setTitle('');
    } catch (err) {
      toast.error('Failed to create category: ' + (err?.data?.error || 'Unknown error'));

    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Add Category</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Enter category title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Category'}
        </Button>
      </form>

      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
      {slug && (
        <div className="mt-2 text-sm text-green-600">
          <strong>Generated Slug:</strong> {slug}
        </div>
      )}
    </div>
  );
};


export default AddCategory
