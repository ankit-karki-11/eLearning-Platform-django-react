import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const Course = () => {
  return (
    <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image that fits properly within the card */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src='https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
          alt="Modern Web Development course"
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-black text-xs">
          Advanced
        </Badge>
      </div>

      {/* Content area with simplified design */}
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium text-lg line-clamp-1">
          Modern Web Development
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-2">
          Master React, Next.js, and modern tooling in this comprehensive course
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage  src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-gray-100">RG</AvatarFallback>
            </Avatar>
            <span className="text-sm">Ram Gopal</span>
          </div>
          <span className="font-bold">₹250</span>
          <span className="font-bold">Duration:2 Weeks</span>
        </div>
        

        <Button className="w-full mt-1" size="sm">
          Enroll Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Course;