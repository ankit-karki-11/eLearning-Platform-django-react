import { LayoutDashboard, BookOpen, ListOrdered, Tags } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { path: '/admin/courses', icon: <BookOpen size={18} />, label: 'Courses', end: true },
    { path: '/admin/sections', icon: <ListOrdered size={18} />, label: 'Lectures', end: true },
    { path: '/admin/courses/categories', icon: <Tags size={18} />, label: 'Categories' },
  ];

  return (
    <aside className="hidden lg:block w-56 p-4 bg-white border-r border-gray-200 h-screen sticky top-0 mt-12">
      <nav className="space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end} 
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${
                isActive
                  ? 'bg-blue-50 text-gray-900 border-l-4 border-gray-900 -ml-3 pl-6'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;