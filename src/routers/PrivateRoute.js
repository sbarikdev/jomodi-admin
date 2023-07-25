import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ user, children }) => {
    const isAuthenticated = user; 
    const location = useLocation();
    const authenticate = localStorage.getItem('authenticated');

    return authenticate ? (
        children
    ) : (
        <Navigate
            to="/login"
        />
    );
};

export default PrivateRoute;