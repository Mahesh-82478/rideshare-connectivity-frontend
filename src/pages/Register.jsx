import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PASSENGER",
    vehicleNumber: "",
    vehicleType: "",
    vehicleSeats: ""
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

    setMessage("Registering...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
            vehicleNumber:
              formData.role === "DRIVER"
                ? formData.vehicleNumber
                : null,
            vehicleType:
              formData.role === "DRIVER"
                ? formData.vehicleType
                : null,
            vehicleSeats:
              formData.role === "DRIVER"
                ? Number(formData.vehicleSeats)
                : null
          })
        }
      );

      if (response.ok) {
        setMessage("Registration successful!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "PASSENGER",
          vehicleNumber: "",
          vehicleType: "",
          vehicleSeats: ""
        });
      } else {
        const errorText = await response.text();
        setMessage(errorText || "Registration failed.");
      }
    } catch (error) {
      setMessage("Cannot connect to the backend.");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join RideShare Connectivity
        </p>

        <form onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Choose Role</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="PASSENGER">Passenger</option>
            <option value="DRIVER">Driver</option>
          </select>

          {formData.role === "DRIVER" && (
            <div className="driver-fields">

              <label>Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                placeholder="Example: TS09AB1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />

              <label>Vehicle Type</label>
              <input
                type="text"
                name="vehicleType"
                placeholder="Example: Car"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              />

              <label>Vehicle Seats</label>
              <input
                type="number"
                name="vehicleSeats"
                min="1"
                placeholder="Example: 4"
                value={formData.vehicleSeats}
                onChange={handleChange}
                required
              />

            </div>
          )}

          <button
            type="submit"
            className="register-submit"
          >
            Register
          </button>

        </form>

        {message && (
          <p className="register-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Register;