import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ListOrdered, 
  Tags, 
  PanelTopIcon, 
  List, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/admin/courses', icon: <BookOpen size={20} />, label: 'Courses', end: true },
    { path: '/admin/sections', icon: <ListOrdered size={20} />, label: 'Lectures', end: true },
    { path: '/admin/enrollments', icon: <ListOrdered size={20} />, label: 'Enrollments', end: true },
    { path: '/admin/courses/categories', icon: <Tags size={20} />, label: 'Categories', end: true },
    { path: '/admin/tests/topics', icon: <PanelTopIcon size={20} />, label: 'Topics', end: true },
    { path: '/admin/tests', icon: <List size={20} />, label: 'Tests', end: true },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Toggle button for desktop */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:fixed lg:flex items-center justify-center top-20 left-56 z-30 w-6 h-10 bg-gray-200 rounded-r-md hover:bg-gray-300 transition-all duration-300"
        style={{ left: isCollapsed ? '4.5rem' : '14rem' }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 
        transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-56'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:justify-center lg:flex-col lg:py-4">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold lg:text-center">Admin Panel</h2>
            )}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 mt-4 p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg lg:hidden"
      >
        <LayoutDashboard size={24} />
      </button>
    </>
  );
};

export default Sidebar;