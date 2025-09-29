import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiEndpoint } from '../api';
import './login_u.css';

const Login_u = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fix for mobile viewport height
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
    return () => window.removeEventListener('resize', appHeight);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        apiEndpoint('/api/auth/login'),
        { phoneNumber, password },
        { withCredentials: true }
      );
      console.log('Login response:', response.data); // Debug: Check login response
      if (response.status === 200) {
        const { userId } = response.data; // Assuming userId is returned in the response
        if (userId) {
          navigate('/user', { state: { userId }, replace: true }); // Pass userId in state
        } else {
          setError('User ID not found in response');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message); // Debug: Log error
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleSignupNavigation = () => {
    navigate('/usersignup');
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-box">
        <h2 className="auth-form-title">Welcome Back</h2>
        {error && <div className="auth-form-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="auth-form-group">
            <label className="auth-form-label">Phone Number</label>
            <input
              className="auth-form-input"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-form-label">Password</label>
            <input
              className="auth-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-form-button">
            Log In
          </button>
        </form>
        <p className="auth-form-text">
          Don't have an account? 
          <span className="auth-form-link" onClick={handleSignupNavigation}> Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login_u;