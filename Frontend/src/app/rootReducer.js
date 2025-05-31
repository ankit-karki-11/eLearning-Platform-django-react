import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import authApi from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { paymentApi } from '@/features/api/paymentApi';

const rootReducer = combineReducers({
     [authApi.reducerPath]:authApi.reducer,
     [courseApi.reducerPath]:courseApi.reducer,
    [paymentApi.reducerPath]:paymentApi.reducer,
    auth: authReducer,

});

export default rootReducer;