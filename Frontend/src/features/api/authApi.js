import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = "http://localhost:8000/api/v1/";


// use query for 'GET' methods
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        // credentials: "include", 
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "auth/register/",
                method: "POST",
                body: inputData,
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "auth/login/",
                method: "POST",
                body: inputData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled; // Correct destructuring
                    // Save access and refresh tokens
                    localStorage.setItem("accessToken", data.access);
                    localStorage.setItem("refreshToken", data.refresh);
                    // Dispatch userLoggedIn only if user data exists in response
                    if (data.user) {
                        dispatch(userLoggedIn({ user: data.user }));
                    }
                    console.log("Tokens saved to localStorage:", data);
                } catch (error) {
                    console.log("Login error:", error);
                }
            }

        }),

        // logout user
        logoutUser: builder.mutation({
            query: (body) => ({
                url: "auth/logout/",
                method: "POST",
                body,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),


        loadUser: builder.query({
            query: () => ({
                url: "users/profile/",
                method: "GET"
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn({ user: data.user }));
                } catch (error) {
                    console.log(error);
                }
            }

        }),

        // update profile

        updateUser:builder.mutation({
             query: (formData) => ({
                url: "users/profile/update/",
                method: "POST",
                body:formData,
                credentials:"include"

            }),

        })


    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
   
} = authApi;

export default authApi;