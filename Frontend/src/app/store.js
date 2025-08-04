import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { paymentApi } from "@/features/api/paymentApi";
import { categoryApi } from "@/features/api/categoryApi";
import { enrollmentApi } from "@/features/api/enrollmentApi";
import { recommendationApi } from "@/features/api/recommendationApi";
import { certificateApi } from "@/features/api/certificateApi";
import { smarttestApi } from "@/features/api/smarttestApi";
import { adminCourseApi } from "@/features/api/adminCourseApi";
import { adminSectionApi } from "@/features/api/adminSectionApi";
import { adminCategoryApi } from "@/features/api/adminCategoryApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware,
        courseApi.middleware,
        paymentApi.middleware,
        categoryApi.middleware,
        enrollmentApi.middleware,
        recommendationApi.middleware,
        certificateApi.middleware,
        smarttestApi.middleware,
        adminCourseApi.middleware,
        adminCategoryApi.middleware,
        adminSectionApi.middleware
    )
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }))

}

initializeApp();