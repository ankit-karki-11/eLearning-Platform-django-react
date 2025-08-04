import { ArrowRight, Folder, Clock } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="group overflow-hidden rounded-lg bg-white border border-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-all w-full flex flex-col cursor-pointer hover:shadow-sm active:scale-[0.98]"
            onClick={() => navigate(`category/${category.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`category/${category.slug}`)}
        >
            <div className="p-5 flex-grow flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
                        <Folder className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <span className="text-xs py-1 px-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {category.courses_count || 0} courses
                    </span>
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
                    {category.title}
                </h3>
                
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(category.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                        <ArrowRight className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;