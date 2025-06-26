import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import authApi from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { paymentApi } from '@/features/api/paymentApi';
import { categoryApi } from '@/features/api/categoryApi';
import { enrollmentApi } from '@/features/api/enrollmentApi';
import { recommendationApi } from '@/features/api/recommendationApi';
import { certificateApi } from '@/features/api/certificateApi';

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [enrollmentApi.reducerPath]: enrollmentApi.reducer,
    [recommendationApi.reducerPath]: recommendationApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    auth: authReducer,

});

export default rootReducer;