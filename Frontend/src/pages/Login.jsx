import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from 'react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    useLoginUserMutation,
    useRegisterUserMutation
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
// const [error, setError] = useState(null);
import { useDispatch } from "react-redux";
import { authApi } from "@/features/api/authApi";
const Login = () => {

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: "",
    })

    const [signupInput, setSignupInput] = useState({
        full_name: "",
        email: "",
        password: "",
    })

    const [registerUser, {
        data: registerData,
        error: registerError,
        isLoading: registerIsLoading,
        isSuccess: registerIsSuccess
    }] = useRegisterUserMutation();

    const [loginUser, {
        data: loginData,
        error: loginError,
        isLoading: loginIsLoading,
        isSuccess: loginIsSuccess
    }] = useLoginUserMutation();

    // console.log(data);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "login") {
            setLoginInput((prev) => ({
                ...prev,
                [name]: value,
            }))
        } else {
            setSignupInput((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;

        try {
            const result = await action(inputData).unwrap();
            console.log("Success:", result);
        } catch (err) {
            console.error("Error:", err);

        }
    };

    useEffect(() => {
        if (registerIsSuccess && registerData) {
            toast.success(registerData.message || "Signup Successful.")
        }
        if (registerError) {
            toast.error(registerError.data?.message || "Signup Failed")
        }
        if (loginIsSuccess && loginData) {
            toast.success(loginData.message || "Login Successful.")

                        // ✅ Store tokens
            localStorage.setItem("accessToken", loginData.access);
            localStorage.setItem("refreshToken", loginData.refresh);

            // ✅ Invalidate user cache or refetch user info
            dispatch(authApi.util.invalidateTags(["User"])); // if you use tags
            dispatch(authApi.endpoints.loadUser.initiate());

            // console.log(loginData);
            navigate("/");
        }
        if (loginError) {
            toast.error(loginError.data?.message || "Login Failed")
        }
    }, [loginIsLoading, registerIsLoading, loginIsSuccess, registerIsSuccess, registerData, registerError, loginData, loginError, navigate])
    
    return (
        <div className="flex mt-16 items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-4">
            <Tabs defaultValue="signup" className="w-full max-w-md">
                <TabsList className="grid grid-cols-2 w-full mb-4 bg-gray-100 p- rounded-md shadow-inner">
                    <TabsTrigger value="signup" className="rounded-md">Signup</TabsTrigger>
                    <TabsTrigger value="login" className="rounded-md">Login</TabsTrigger>
                </TabsList>

                {/* Signup Form */}
                <TabsContent value="signup">
                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>
                                Start your journey with us today.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={signupInput.full_name}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    value={signupInput.email}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={signupInput.password}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")} className="w-full">
                                {
                                    registerIsLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />Please wait...
                                        </>
                                    ) : "Sign Up"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Login Form */}
                <TabsContent value="login">
                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>
                                Log in to continue to your dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    value={loginInput.email}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginInput.password}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} className="w-full" onClick={() => handleRegistration("login")}>
                                {
                                    loginIsLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />Please wait...
                                        </>
                                    ) : "Login"
                                }

                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Login
