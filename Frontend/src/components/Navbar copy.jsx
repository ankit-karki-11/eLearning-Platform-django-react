import { ArrowBigDown, ArrowDown, ChevronDown, Cross, LogIn, Menu, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import DarkMode from '@/DarkMode';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation, useLoadUserQuery } from '@/features/api/authApi';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { authApi } from '@/features/api/authApi';
import { useSearchCoursesQuery } from '@/features/api/courseApi';
import CourseSearchResults from '@/pages/student/CourseSearchResults';

const Navbar = () => {
  const { data: user, isLoading, refetch } = useLoadUserQuery();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('both');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    data: searchResults,
    error: searchError,
    isLoading: searchLoading,
  } = useSearchCoursesQuery(
    { q: searchQuery, field: searchField },
    { skip: !searchQuery.trim() }
  );

  const logoutHandler = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      toast.error("No refresh token found");
      return;
    }
    try {
      await logoutUser({ refresh }).unwrap();
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success(data?.message || "Logged out successfully");
      navigate("/");
    }
  }, [isSuccess, dispatch, data, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}&field=${searchField}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className='h-14 w-full dark:bg-gray-900/95 bg-white backdrop-blur-sm fixed top-0 left-0 right-0 duration-300 z-50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full'>

        <div className='flex items-center gap-6'>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Digital Padhai Logo" className="h-6 w-auto" />
          </Link>

          {/* Search Button for Mobile */}
          <div className='md:hidden'>
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md">
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Search Courses</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <SearchForm
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchField={searchField}
                    setSearchField={setSearchField}
                    onSubmit={handleSearchSubmit}
                    searchResults={searchResults}
                    searchLoading={searchLoading}
                    onResultClick={() => setIsSearchOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <nav className='hidden md:flex items-center gap-4 text-black text-2xl hover:text-red-700 dark:hover:text-gray-200'>
            {/* Navigation links */}
          </nav>
        </div>

        {/* Desktop Search and User controls */}
        <div className='flex items-center gap-4'>
          {/* Desktop Search */}
          <div className='hidden md:flex items-center'>
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchField={searchField}
              setSearchField={setSearchField}
              onSubmit={handleSearchSubmit}
              searchResults={searchResults}
              searchLoading={searchLoading}
              variant="desktop"
            />
          </div>

          {isLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-4 h-10">
                  <span className='hidden sm:inline'>{user.full_name}</span>
                  <Avatar className='h-8 w-8 border-2 border-gray-300 dark:border-gray-600'>
                    <AvatarImage src={user.profile_image_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback className='bg-gray-100 dark:bg-gray-700'>
                      {user.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={10}>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>{user.full_name}</p>
                    <p className='text-xs leading-none text-gray-500 dark:text-gray-400'>
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className='w-full'>
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/courses" className='w-full'>
                      Courses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="courses/my-learning" className='w-full'>
                      My Learning
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === "student" && (
                    <DropdownMenuItem asChild>
                      <Link to="/mcq-test/test" className='w-full'>MCQ Test</Link>
                    </DropdownMenuItem>
                  )}

                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className='w-full'>
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20'
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="px-4 sm:px-3 group py-1 text-sm font-sm rounded-lg border-black dark:border-gray-200 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer "
                asChild
              >
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="w-2 h-2" />
                  <span>Go Login</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <MobileNavbar logoutHandler={logoutHandler} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Form Component
const SearchForm = ({
  searchQuery,
  setSearchQuery,
  searchField,
  setSearchField,
  onSubmit,
  searchResults,
  searchLoading,
  variant = 'desktop',
  onResultClick
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-1 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 placeholder:text-sm ${variant === 'desktop' ? 'w-72' : 'w-full'
              }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
               <X className="h-4 w-4 text-gray-400 cursor-pointer" />
            </button>
          )}
        </div>

        {/* Hidden field that always sends "both" to the API */}
        {searchQuery && (
          <input
            type="hidden"
            name="searchField"
            value="both"
          />
        )}
      </form>

      {/* Search Results Dropdown (Desktop) */}
      {variant === 'desktop' && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <CourseSearchResults
            results={searchResults}
            loading={searchLoading}
            query={searchQuery}
            onResultClick={() => setSearchQuery('')}
          />
        </div>
      )}
    </div>
  );
};

// Reusable NavLink component
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm font-base text-black hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
  >
    {children}
  </Link>
);

// Mobile menu component
const MobileNavbar = ({ logoutHandler, user }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant="ghost"
          className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className='w-[280px] sm:w-[300px]'>
        <SheetHeader className='flex flex-row items-center justify-between'>
          <SheetTitle className='text-lg'>Menu</SheetTitle>
          <div className='flex items-center gap-4'>
            <DarkMode />
          </div>
        </SheetHeader>

        <nav className='flex flex-col space-y-2 mt-6'>
          <SheetClose asChild>
            <NavLink to="/courses">Courses</NavLink>
          </SheetClose>

          {user && (
            <>
              <div className='flex items-center gap-3 mb-3 pt-2 border-t'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={user.profile_image_url || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{user.full_name}</p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </div>

              <SheetClose asChild>
                <NavLink to="/my-learning">My Learning</NavLink>
              </SheetClose>
              <SheetClose asChild>
                <NavLink to="/profile">Profile Settings</NavLink>
              </SheetClose>

              {user.role === "admin" && (
                <SheetClose asChild>
                  <NavLink to="/admin">Admin Dashboard</NavLink>
                </SheetClose>
              )}

              <button
                onClick={logoutHandler}
                className='w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <SheetClose asChild>
                <Button className='w-full mt-2' asChild>
                  <Link to="/login">Get started</Link>
                </Button>
              </SheetClose>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;