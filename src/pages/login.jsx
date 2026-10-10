import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        const user = await response.json();

        // Save logged-in user
        localStorage.setItem(
          "rideshareUser",
          JSON.stringify(user)
        );

        setMessage(
          `Login successful! Welcome ${user.name}`
        );

        // Send user information to App.jsx
        if (onLogin) {
          onLogin(user);
        }

      } else {
        const errorText = await response.text();

        setMessage(
          errorText || "Invalid email or password."
        );
      }

    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to the backend."
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to RideShare Connectivity
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;