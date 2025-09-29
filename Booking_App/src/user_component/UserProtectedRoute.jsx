import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { apiEndpoint } from '../api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
  const response = await axios.get(apiEndpoint('/api/auth/checkvaliduser'), {
          withCredentials: true,
        });
        console.log('Check valid user response:', response.data); // Debug: Check response
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Check valid user error:', err.response?.data || err.message); // Debug: Log error
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/userlogin" replace />;
};

export default ProtectedRoute;