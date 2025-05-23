import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import authApi from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';

const rootReducer = combineReducers({
     [authApi.reducerPath]:authApi.reducer,
     [courseApi.reducerPath]:courseApi.reducer,

    auth: authReducer,

    // Add other reducers here as needed for course and all 
});

export default rootReducer;