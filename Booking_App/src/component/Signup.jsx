import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
 
  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      console.log("Sending data to backend:", formData);
  
import { API_BASE_URL } from '../apiConfig';
// ...existing code...
  const response = await axios.post(`${API_BASE_URL}/api/signup`, formData);
      console.log("Response received:", response.data);
  
      setMessage(response.data.message);
      setFormData({ fullName: "", email: "", password: "" });
      navigate('/barberlogin');
    } catch (error) {
      console.error("Error response:", error.response);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Sign Up</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="form-button">Sign Up</button>
        </form>
        <p className="toggle-text">
          Already have an account?{" "}
          <a href="/barberlogin" className="link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
