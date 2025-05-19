import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Clock, Tag, Star, ShoppingCart } from 'lucide-react';
import React from 'react';

const Course = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-1">
      {/* Course image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src='https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
          alt="Modern Web Development course"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
        
        {/* Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-0.5">
            Advanced
          </Badge>
        </div>
        
        {/* Rating chip */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded-full">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">4</span>
        </div>
      </div>

      <CardContent className="px-3 pt-2 pb-1 space-y-2">
        <h3 className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white line-clamp-2 ">
          Modern Web Development with React & Next.js
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-white dark:border-gray-800 shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xs font-medium">RG</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-xs">Dr. Ram Gopal</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Google</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs pt-1">
          {/* <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Tag className="h-3 w-3 text-indigo-500" />
            <span>Web Dev(1200)</span>
          </div> */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Clock className="h-3 w-3 text-indigo-500" />
            <span>Duration:   24 hrs</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-3 pb-3 pt-1">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Rs 250</span>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="p-2 h-8 w-8">
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-8 px-3 bg-gray-900 hover:bg-gray-800 text-white">
            Enroll
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
     
    </div>

    
  );
};

export default Course;