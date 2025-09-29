import React, { useState, useEffect } from 'react';
import { apiEndpoint } from '../api';
import { useNavigate } from 'react-router-dom';
import './sign_u.css';

const Sign_u = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    email: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Add viewport height fix for mobile
  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
    return () => window.removeEventListener('resize', appHeight);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiEndpoint('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/userlogin');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Server error');
    }
  };

  const handleLoginNavigation = () => {
    navigate('/userlogin');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h2 className="signup-title">Create Your Account</h2>
        </div>
        {error && (
          <div className="signup-error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        <form onSubmit={handleSignup}>
          <div className="signup-form-group">
            <label className="signup-label">
              <i className="fas fa-user"></i> Full Name
            </label>
            <input
              className="signup-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="signup-form-group">
            <label className="signup-label">
              <i className="fas fa-phone"></i> Phone Number
            </label>
            <input
              className="signup-input"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <div className="signup-form-group">
            <label className="signup-label">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              className="signup-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>
          <div className="signup-form-group">
            <label className="signup-label">
              <i className="fas fa-envelope"></i> Email Address
            </label>
            <input
              className="signup-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="signup-form-group">
            <label className="signup-label">
              <i className="fas fa-map-marker-alt"></i> Address
            </label>
            <input
              className="signup-input"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
        <div className="signup-footer">
          Already have an account?
          <span className="signup-link" onClick={handleLoginNavigation}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sign_u;