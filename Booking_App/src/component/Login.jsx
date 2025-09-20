import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store JWT token
        localStorage.setItem("adminId", response.data.adminId); // Store Admin ID

        const adminId = response.data.adminId;
        const uniqueId = response.data.uniqueId; // Assuming uniqueId is returned in the response
        setMessage("Login successful!");

        // Pass both adminId and uniqueId to BarberHome via navigation state
        navigate("/barberhome", { state: { adminId, uniqueId } });
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setMessage("Error logging in. Please check your credentials.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
        {message && <p>{message}</p>}
        <p className="toggle-text">
          Don't have an account?{" "}
          <Link to="/barbersignup" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;