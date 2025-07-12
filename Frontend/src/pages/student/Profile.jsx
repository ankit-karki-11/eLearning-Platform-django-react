import React, { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Mail, Settings, Bookmark, LogOut, User, Calendar, MapPin, MailCheck, Calendar1, Phone, Settings2, LogOutIcon, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'


// query in api use {}
// mutuation becz of post use []

const Profile = () => {
    // for getting the data of user
    const [full_name, setFull_name] = useState("");
    const [profile_image, setProfile_image] = useState("");
    const [phone_number, setPhone_number] = useState("");
    
    // 1.bring query
    const { data, isLoading, refetch } = useLoadUserQuery();

    const [updateUser, { data: updateUserdata, isLoading: updateUserIsLoading, error, isError, isSuccess }] = useUpdateUserMutation();


    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfile_image(file);
    }
   
    const updateUserHandler = async () => {
        // apI integration via rtk
        console.log(full_name, profile_image, phone_number);
        const formData = new FormData();
        formData.append("full_name", full_name);
        formData.append("profile_image", profile_image);
        formData.append("phone_number", phone_number);
        
        await updateUser(formData);
    }
    // for message toast
    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.message || "Profile Updated Successfully")
        }
        if (isError) {
            toast.error(error.message || "Error while updating profile")
        }
    }, [error,updateUserdata,  isSuccess, isError])

    if (isLoading) return <h1>Profile is Loading.....</h1>

    const enrolledCourses = [];
    const certificates = [];

    console.log(data);
    const user = data ;

    return (
        <div className='max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8'>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm daek:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* cover photo */}
                <div className='h-24 relative'>
                    <div className='absolute -bottom-16 left-6'>
                        <Avatar className='h-32 w-32 border-4 border-white dark:border-gray-900'>
                            <AvatarImage src={user?.profile_image_url || "https://github.com/shadcn.png"} />
                            <AvatarFallback className='bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-2xl font-bold'>
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                
                <div className="pt-20 px-6 pb-6">
                    <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-6'>
                        
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                                    {user.full_name}
                                </h1>
                            </div>
                            <p className="text-sm font-sm text-gray-900 dark:text-gray-200 max-w-lg">
                                {user.role}
                            </p>

                            <div className='flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400'>
                                <div className='flex items-center gap-1.5'>
                                    <Mail className='h-4 w-4' />
                                    <span> {user.email}</span>

                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar1 className='h-4 w-4' />
                                    <span> {user.created_at}</span>

                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className='h-4 w-4' />
                                    <span> {user.phone_number || "Private"}</span>
                                </div>
                            </div>
                        </div>
                   
                        <div className="flex gap-2">
                            
                            <Dialog>
                                <DialogTrigger asChild>

                                    <Button variant="outline" className='gap-2'>
                                        <Settings2 className='h-4 w-4' />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Photo
                                            </Label>
                                            <Input
                                                id="image"
                                                type="file"
                                                onChange={onChangeHandler}
                                                accept="image/*"
                                                className="col-span-3" />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="fullname" className="text-right">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="fullname"
                                                type="text"
                                                value={full_name}
                                                onChange={(e) => setFull_name(e.target.value)}
                                                placeholder="Enter your name"
                                                className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="phone" className="text-right">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={phone_number}
                                                onChange={(e) => setPhone_number(e.target.value)}
                                                placeholder="9812345678"
                                                className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={updateUserIsLoading} onClick={updateUserHandler}>
                                            {
                                                updateUserIsLoading ? (
                                                    <>
                                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                        Saving.............
                                                    </>
                                                ) : "Save changes"
                                            }
                                        </Button>
                                    </DialogFooter>

                                </DialogContent>

                            </Dialog>

                            <Button variant="outline" className='gap-2'>
                                <LogOutIcon className='h-4 w-4' />
                                Logout
                            </Button>
                        </div>
                    </div>

                    
                    <Tabs defaultValue="courses" className="mt-8">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="courses">My Courses</TabsTrigger>
                            <TabsTrigger value="certificates">Certificates</TabsTrigger>
                        </TabsList>

                        <TabsContent value="courses" className="mt-6 py-8">
                            {enrolledCourses.length === 0 ? (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                        You haven't enrolled in any courses yet
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Browse our courses to get started on your learning journey.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {enrolledCourses.map((course, index) => (
                                        <Course key={index} {...course} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="certificates" className="mt-6 py-8">
                            {certificates.length === 0 ? (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                        No certificates yet
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Complete courses to earn certificates.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6">

                                    {certificates.map((cert, index) => (
                                        <Certificate key={index} {...cert} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Profile