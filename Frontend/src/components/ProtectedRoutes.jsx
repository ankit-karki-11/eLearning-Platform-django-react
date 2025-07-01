import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ allowedRoles = [] }) => {
    const location = useLocation();
    // const user = JSON.parse(localStorage.getItem('user'))
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAuthenticated = !!user;
    const userRole = user?.role;

    // If not logged in, redirect to login and store the current page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />

    }

    //  if user's role is not authoriized,redirect to unauthorized page
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />

    }

    //if authenticated and authorized , show the children routes
    return <Outlet />

};

export default ProtectedRoutes
