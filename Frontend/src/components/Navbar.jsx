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

  return (
    <div className='h-16 w-full dark:bg-gray-900/95 bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 duration-300 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full'>

        <div className='flex items-center gap-8'>
          <Link to="/" className='flex items-center gap-2'>
            <img src="/logoblack.png" alt="Logo" className='h-8 w-auto' />
          </Link>


          <nav className='hidden md:flex items-center gap-4 text-black hover:text-red-700 dark:hover:text-gray-200'>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/courses">Courses</NavLink>

            {user?.role === "student" && (
              <NavLink to="/courses/my-learning">My Learning</NavLink>
            )}

            {user?.role === "student" && (
              <NavLink to="/smart-test/test">Smart-Test</NavLink>
            )}
            {user?.role === "instructor" && (
              <NavLink to="/instructor/dashboard">Instructor</NavLink>
            )}


          </nav>
        </div>
        {/* User controls - Right side */}
        <div className='flex items-center gap-4'>
          <div className='hidden md:block'>
            <DarkMode />
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
                    <Link to="courses/my-learning" className='w-full'>
                      My Learning
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "instructor" && (
                    <DropdownMenuItem asChild>
                      <Link to="/instructor/dashboard" className='w-full'>
                        Instructor Dashboard
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
            <div className='flex items-center gap-2'>
              <Button className='px-3 sm:px-4' variant='outline' asChild>
                <Link to="/login">Login</Link>
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
            <NavLink to="/course">Courses</NavLink>
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

              {user.role === "instructor" && (
                <SheetClose asChild>
                  <NavLink to="/instructor/dashboard">Instructor Dashboard</NavLink>
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
              {/* <SheetClose asChild>
                <NavLink to="/login">Sign in</NavLink>
              </SheetClose> */}
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