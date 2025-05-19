import { Menu, School } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'

import DarkMode from '@/DarkMode'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const user = true;
    //  const role = instructor;
    return (
        <div className='h-16 w-full dark:bg-[#0A0A0A]/80 bg-white/80 border-b dark:border-b-gray-800/80 border-b-gray-200/80 backdrop-blur-lg fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* desktop */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex justify-between items-center h-full'>
                <div className='flex items-center gap-2'>
                    <Link to={""}>

                        <h1 className='hidden md:block font-extrabold text-xl'>Padhai</h1>
                    </Link>

                </div>

                {/* user icons and dark mode icon */}
                <div className='flex items-center gap-4'>
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className='cursor-pointer'>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to="my-profile"> Profile</Link>

                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem>
                                            Edit Profile
                                        </DropdownMenuItem> */}
                                        <DropdownMenuItem>
                                            <Link to="my-learning">My Learning </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link to="my-learning">My courses </Link>

                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        Log out
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        Dashboard
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Button variant='outline' className='px-4'>Join Us</Button>
                            </div>
                        )
                    }
                    <DarkMode />
                </div>
            </div>

            {/* mobile view */}
            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1>Padhai</h1>
                <MobileNavbar />
            </div>


        </div>
    )
}

export default Navbar

const MobileNavbar = () => {
    const role = "instructor"
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline"><Menu /> </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className='flex flex-row items-center justify-between mt-2'>
                    <SheetTitle>padhai</SheetTitle>
                    <DarkMode />
                </SheetHeader>

                <nav className='flex flex-col space-y-4'>
                    <span>My Learning</span>
                    <span>Edit Profile</span>
                    <p>
                        Logout
                    </p>
                </nav>
                {
                    role == "instructor" && (
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button >My Dashboard</Button>
                            </SheetClose>
                        </SheetFooter>
                    )
                }

            </SheetContent>
        </Sheet>
    );
};