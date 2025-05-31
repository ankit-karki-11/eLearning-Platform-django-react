import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all w-full flex flex-col cursor-pointer hover:border-primary hover:border hover:dark:border-primary-foreground"
            onClick={() => navigate(`category/${category.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`category/${category.slug}`)}
        >
            <div className="p-4 flex-grow flex flex-col h-full">
                <h3 className="font-semibold text-base line-clamp-2 dark:text-white mb-2">
                    {category.title}
                </h3>
                
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(category.created_at).toLocaleDateString()}
                        {/* {category.slug} */}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
            </div>
        </div>
    );
};

export default Category;