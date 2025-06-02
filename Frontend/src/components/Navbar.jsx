import { Menu } from 'lucide-react';
import React, { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import DarkMode from '@/DarkMode';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation, useLoadUserQuery } from '@/features/api/authApi';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { authApi } from '@/features/api/authApi';

const Navbar = () => {
  const { data: user, isLoading, refetch } = useLoadUserQuery();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      toast.error("No refresh token found");
      return;
    }
    await logoutUser({ refresh });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(authApi.util.resetApiState()); 
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, dispatch, data, navigate]);

  return (
    <div className='h-16 w-full dark:bg-gray-900/95 bg-white/95 border-b dark:border-gray-800 border-gray-200 backdrop-blur-lg fixed top-0 left-0 right-0 duration-300 z-50 shadow-sm'>
      {/* Desktop Navigation */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex justify-between items-center h-full'>
        <div className='flex items-center gap-2'>
          <Link to="/" className='flex items-center gap-2'>
            <img src="/logo.png" alt="Logo" className='h-8 w-auto' />
            <span className='font-semibold text-lg text-gray-800 dark:text-gray-200'>Padhai</span>
          </Link>
        </div>

        {/* User controls */}
        <div className='flex items-center gap-4'>
          {isLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-3 cursor-pointer'>
                  <Avatar className='h-9 w-9 border-2 border-gray-300 dark:border-gray-600'>
                    <AvatarImage src={user.profile_image_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback className='bg-gray-100 dark:bg-gray-700'>
                      {user.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
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
                    <Link to="/my-learning" className='w-full'>
                      My Learning
                    </Link>
                  </DropdownMenuItem>
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
            <div className='flex items-center gap-3'>
              <Button variant='ghost' className='px-4'>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button className='px-4'>
                <Link to="/register">Get started</Link>
              </Button>
            </div>
          )}
          <div className='ml-2'>
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className='flex md:hidden items-center justify-between px-4 h-full'>
        <Link to="/" className='flex items-center gap-2'>
          <img src="/logo.png" alt="Logo" className='h-7 w-auto' />
          <span className='font-semibold text-gray-800 dark:text-gray-200'>Padhai</span>
        </Link>
        <MobileNavbar logoutHandler={logoutHandler} user={user} />
      </div>
    </div>
  );
};

export default Navbar;

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

        <nav className='flex flex-col space-y-3 mt-8'>
          {user && (
            <>
              <div className='flex items-center gap-3 mb-4'>
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
                <Link 
                  to="/my-learning" 
                  className='px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                >
                  My Learning
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  to="/profile" 
                  className='px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                >
                  Profile Settings
                </Link>
              </SheetClose>
              <button 
                onClick={logoutHandler} 
                className='px-3 py-2 rounded-md text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <SheetClose asChild>
                <Link 
                  to="/login" 
                  className='px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                >
                  Sign in
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  to="/register" 
                  className='px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                >
                  Get started
                </Link>
              </SheetClose>
            </>
          )}
        </nav>

        {user?.role === "instructor" && (
          <SheetFooter className="mt-8">
            <SheetClose asChild>
              <Button className='w-full' asChild>
                <Link to="/instructor/dashboard">
                  Instructor Dashboard
                </Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};