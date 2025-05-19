import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import React from 'react';

const Course = () => {
  return (
    <Card className="overflow-hidden max-w-sm transition-all hover:shadow-lg">
      {/* Image container with proper aspect ratio and positioning */}
      <div className="relative">
        <img
          src='https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
          alt="Modern Web Development course"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1">
            Advanced
          </Badge>
        </div>
      </div>

      {/* Content area with improved spacing and organization */}
      <CardContent className="pt-5 pb-2">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Modern Web Development
        </h3>

        <div className="space-y-4">
          {/* Instructor info with better alignment */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-100 text-indigo-800">RG</AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-700">Dr. Ram Gopal</span>
          </div>

          {/* Course details with icons */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Tag size={16} />
              <span className="text-sm">Web Development</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span className="text-sm">2 Weeks</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2 pb-5 px-6">
        <span className="font-bold text-lg text-gray-900">₹ 250</span>
        <Button className="bg-gray-950 hover:bg-gray-900">
          Enroll Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Course;