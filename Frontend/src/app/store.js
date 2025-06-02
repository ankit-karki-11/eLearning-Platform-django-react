import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { paymentApi } from "@/features/api/paymentApi";
import { categoryApi } from "@/features/api/categoryApi";
import { enrollmentApi } from "@/features/api/enrollmentApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware,
        courseApi.middleware,
        paymentApi.middleware,
        categoryApi.middleware,
        enrollmentApi.middleware
    )
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }))

}

initializeApp();