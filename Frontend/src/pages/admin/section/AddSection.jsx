import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Trash2, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoadCourseQuery } from '@/features/api/adminCourseApi';
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  usePublishCourseMutation
} from '@/features/api/adminCourseApi';

const AddSection = () => {
  // State for course selection
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('');

  // State for sections
  const [sections, setSections] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionVideo, setSectionVideo] = useState(null);
  const [sectionOrder, setSectionOrder] = useState(1);
  const [isFree, setIsFree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // API hooks
  const { data: courses = [], isLoading: loadingCourses } = useLoadCourseQuery();
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [publishCourse] = usePublishCourseMutation();

  // Load sections when course is selected
  useEffect(() => {
    if (selectedCourseId) {
      const course = courses.find(c => c.id === selectedCourseId);
      if (course) {
        setSelectedCourseSlug(course.slug);
        if (course.sections) {
          setSections([...course.sections].sort((a, b) => a.order - b.order));
        } else {
          setSections([]);
        }
        setSectionOrder((course?.sections?.length || 0) + 1);
      }
    }
  }, [selectedCourseId, courses]);

  const handleAddSection = () => {
    if (!sectionTitle) {
      toast.error('Section title is required');
      return;
    }

    const newSection = {
      id: `temp-${Date.now()}`, // Temporary ID for local state
      title: sectionTitle,
      order: sectionOrder,
      is_free: isFree,
      video: sectionVideo,
      course: selectedCourseId,
      isNew: true
    };

    setSections([...sections, newSection].sort((a, b) => a.order - b.order));

    // Reset form
    setSectionTitle('');
    setSectionVideo(null);
    setSectionOrder(sections.length + 2);
    setIsFree(false);
  };

  const handleUpdateSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.title) {
      toast.error('Section title is required');
      return;
    }

    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, title: section.title, order: section.order, is_free: section.is_free } : s
    ).sort((a, b) => a.order - b.order));
  };

  const handleRemoveSection = (sectionId) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const handleMoveSection = (sectionId, direction) => {
    const index = sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      newSections[index].order = index + 1;
      newSections[index - 1].order = index;
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      newSections[index].order = index + 1;
      newSections[index + 1].order = index + 2;
    }

    setSections(newSections);
  };

  const handleSaveSections = async () => {
    if (!selectedCourseId) {
      toast.error('Please select a course first');
      return;
    }

    setIsLoading(true);
    try {
      // Process all sections
      for (const section of sections) {
        const formData = new FormData();
        formData.append('title', section.title);
        formData.append('course', selectedCourseId);
        formData.append('order', section.order);
        formData.append('is_free', section.is_free);
        if (section.video) formData.append('video', section.video);

        if (section.isNew) {
          await createSection(formData).unwrap();
        } else if (section.changed) {
          await updateSection({ id: section.id, data: formData }).unwrap();
        }
      }

      toast.success('All sections saved successfully!');
      // Refresh sections data
      const course = courses.find(c => c.id === selectedCourseId);
      setSections([...course.sections].sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error(error.data?.message || 'Failed to save sections');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishCourse = async () => {
    if (!selectedCourseSlug) {
      toast.error('Please select a course first');
      return;
    }

    if (sections.length === 0) {
      toast.error('Please add at least one section before publishing');
      return;
    }
    if (sections.filter(s => s.video).length === 0) {
      toast.error('Please add at least one video section before publishing');
      return;
    }

    setIsPublishing(true);
    try {
      // First save all sections
      await handleSaveSections();

      // Then publish the course using the slug
      await publishCourse(selectedCourseSlug).unwrap();
      toast.success('Course published successfully!');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error(error.data?.detail || error.data?.message || 'Failed to publish course');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="space-y-2 mt-12">
        <h1 className="text-xl font-bold">Add Sections to Course</h1>
        <p className="text-sm text-gray-600">
          Select a course and add sections with videos. You can reorder sections as needed.
        </p>
      </div>

      {/* Course Selection */}
      <div className="space-y-2">
        <Label>Select Course *</Label>
        <Select
          value={selectedCourseId}
          onValueChange={(courseId) => {
            setSelectedCourseId(courseId);
            const course = courses.find(c => c.id === courseId);
            if (course) setSelectedCourseSlug(course.slug);
          }}
          disabled={loadingCourses}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Select a course"} />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourseId && (
        <>
          {/* Add Section Form */}
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="font-medium">Add New Section</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title *</Label>
                <Input
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Introduction to Course"
                />
              </div>

              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={sectionOrder}
                  onChange={(e) => setSectionOrder(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isFree"
                checked={isFree}
                onCheckedChange={(checked) => setIsFree(checked)}
              />
              <Label htmlFor="isFree">Mark as free section</Label>
            </div>

            <div className="space-y-2">
              <Label>Video File (MP4)</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => setSectionVideo(e.target.files[0])}
              />
              {sectionVideo && (
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <span>Selected: {sectionVideo.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSectionVideo(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            <h2 className="font-medium">Course Sections</h2>

            {sections.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">No sections added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveSection(section.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveSection(section.id, 'down')}
                            disabled={index === sections.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Input
                              value={section.title}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].title = e.target.value;
                                newSections[index].changed = true;
                                setSections(newSections);
                              }}
                              className="font-medium"
                            />
                            {section.is_free && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Free
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-gray-600">Order:</Label>
                              <Input
                                type="number"
                                value={section.order}
                                onChange={(e) => {
                                  const newSections = [...sections];
                                  newSections[index].order = Number(e.target.value);
                                  newSections[index].changed = true;
                                  setSections(newSections);
                                }}
                                className="w-16 h-8"
                                min="1"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`free-${section.id}`}
                                checked={section.is_free}
                                onCheckedChange={(checked) => {
                                  const newSections = [...sections];
                                  newSections[index].is_free = checked;
                                  newSections[index].changed = true;
                                  setSections(newSections);
                                }}
                              />
                              <Label htmlFor={`free-${section.id}`} className="text-sm text-gray-600">
                                Free section
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Video section */}
                    <div className="mt-3">
                      <Label className="text-sm">Video:</Label>
                      {section.video ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {section.video.name || 'Video attached'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newSections = [...sections];
                              newSections[index].video = null;
                              newSections[index].changed = true;
                              setSections(newSections);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept="video/mp4"
                          className="mt-1"
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].video = e.target.files[0];
                            newSections[index].changed = true;
                            setSections(newSections);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleSaveSections}
              disabled={isLoading || sections.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Sections'
              )}
            </Button>

            <Button
              onClick={handlePublishCourse}
              disabled={isPublishing || sections.length === 0}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Save & Publish Course'
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddSection;