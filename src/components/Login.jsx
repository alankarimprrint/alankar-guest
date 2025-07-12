"use client";
import { useState } from "react";
import api from "../config/api";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/guestlogin", null, {
        params: {
          email: username,
          password: password,
        },
      });
      console.log(response)

      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        sessionStorage.setItem("accessToken", accessToken);
        console.log("accessToken", sessionStorage.getItem("accessToken"))
        sessionStorage.setItem("refreshToken", refreshToken);
        onLogin(); // proceed to dashboard
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Alankar Guest Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default Login;
