import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('accessToken');
    return isAuthenticated ? <Outlet /> : <Navigate to="/signIn" />;
};

export default ProtectedRoute;
