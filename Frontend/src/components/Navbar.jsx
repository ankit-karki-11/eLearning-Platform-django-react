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
import { authApi } from '@/features/api/authApi'; // important for resetApiState

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
      dispatch(authApi.util.resetApiState()); // clears all cached queries
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, dispatch, data, navigate]);

  return (
    <div className='h-16 w-full dark:bg-[#0A0A0A]/80 bg-white/80 border-b dark:border-b-gray-800/80 border-b-gray-200/80 backdrop-blur-lg fixed top-0 left-0 right-0 duration-300 z-10'>
      {/* desktop */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex justify-between items-center h-full'>
        <div className='flex items-center gap-2 px-8'>
          <Link to="/">
            <h1 className='hidden md:block font-extrabold text-xl'>
              <img src="/logo.png" alt="Logo" className='inline-block h-6' /> padhai
            </h1>
          </Link>
        </div>

        {/* user icons and dark mode icon */}
        <div className='flex items-center gap-4 px-8'>
          { isLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='cursor-pointer'>
                  <AvatarImage src={user.profile_image_url || "https://github.com/shadcn.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel> <h2>{user.full_name}</h2></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center gap-2'>
              <Button variant='outline' className='px-4'><Link to="/login">Create Account</Link></Button>
              

            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* mobile view */}
      <div className='flex md:hidden items-center justify-between px-4 h-full'>
        <h1>Padhai</h1>
        <MobileNavbar logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;

// ⬇️ Mobile menu component
const MobileNavbar = ({ logoutHandler }) => {
  const role = "instructor";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className='flex flex-row items-center justify-between mt-2'>
          <SheetTitle>padhai</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <nav className='flex flex-col space-y-4 mt-4'>
          <Link to="/my-learning">My Learning</Link>
          <Link to="/profile">Edit Profile</Link>
          <button onClick={logoutHandler} className='text-left text-red-600 cursor-pointer'>
            Logout
          </button>
        </nav>

        {role === "instructor" && (
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button>My Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
