

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
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
import { useLoadSectionQuery } from '@/features/api/adminCourseApi';
import { useLoadCourseQuery } from '@/features/api/adminCourseApi';
import { Edit, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const SectionTable = () => {
  const navigate = useNavigate();
  const { data: sections = [], isLoading, refetch } = useLoadSectionQuery();
  const { data: courses = [], isLoading: isLoadingCourses } = useLoadCourseQuery();
  const [expandedCourses, setExpandedCourses] = useState({});

  // Group sections by course and sort by course title
  const groupedSections = courses
    .map(course => ({
      courseId: course.id,
      courseTitle: course.title,
      sections: sections
        .filter(section => section.course === course.id)
        .sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));

  const toggleCourseExpand = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (isLoading || isLoadingCourses) {
    return (
      <div className="w-full px-3 py-14 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-14">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Course Sections</h2>
        <Button 
          onClick={() => navigate('add')} 
          size="sm" 
          className="h-8 px-3 text-xs cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 inline-block mr-1" /> 
          Add New Section
        </Button>
      </div>

      <Table className="text-sm border">
        <TableCaption className="text-xs text-muted-foreground mb-2">
          {sections.length === 0 ? 'No sections found' : 'List of all course sections'}
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-4 py-2 w-[50px]">#</TableHead>
            <TableHead className="px-4 py-2">Course</TableHead>
            <TableHead className="px-4 py-2 w-[100px] text-right">Sections</TableHead>
            <TableHead className="px-4 py-2 w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groupedSections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-muted-foreground">No sections found</p>
                  <Button 
                    onClick={() => navigate('add')} 
                    size="sm" 
                    variant="outline"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create First Section
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            groupedSections.map((group, index) => (
              <React.Fragment key={group.courseId}>
                {/* Course Header Row */}
                <TableRow className="hover:bg-muted/50 font-medium">
                  <TableCell className="px-4 py-2">{index + 1}</TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {group.sections.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => toggleCourseExpand(group.courseId)}
                        >
                          {expandedCourses[group.courseId] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {group.courseTitle}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {group.sections.length}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 px-3 mr-2"
                      onClick={() => navigate(`/admin/courses/${group.courseId}/sections/add`)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    {group.sections.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="h-8 px-3"
                        onClick={() => navigate(`/admin/courses/${group.courseId}/sections`)}
                      >
                        Manage
                      </Button>
                    )}
                  </TableCell>
                </TableRow>

                {/* Section Rows (visible when expanded) */}
                {expandedCourses[group.courseId] && group.sections.map((section) => (
                  <TableRow key={section.id} className="hover:bg-muted/30 bg-muted/10">
                    <TableCell className="px-4 py-2"></TableCell>
                    <TableCell className="px-4 py-2 pl-12">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{section.order}.</span>
                        <span>{section.title}</span>
                        {section.is_free && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      Order: {section.order}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-blue-500"
                        onClick={() => navigate(`/admin/sections/edit/${section.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => console.log('Delete', section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          )}
        </TableBody>

        {sections.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right text-xs text-muted-foreground py-2">
                Showing {sections.length} sections across {groupedSections.length} courses
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
};

export default SectionTable;