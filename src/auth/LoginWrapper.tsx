// LoginWrapper.tsx
import React, { useRef } from 'react';
import { Login } from './login';  // Adjust import path as needed
import { Navigate } from 'react-router-dom';

export const LoginWrapper = () => {
    const mountKey = useRef(Date.now()).current;

    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem('user_token'); // adjust based on your auth token key

    if (isAuthenticated) {
        return <Navigate to="/ace/landing" replace />;
    }

    return <Login key={mountKey} />;
};
