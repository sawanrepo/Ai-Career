import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState({
    email: null,
    username: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Debounced Email Checker
  const checkEmail = useMemo(
    () =>
      debounce(async (email) => {
        if (!email) return;
        try {
          await axios.get(`${API}/auth/email/${email}`);
          setAvailability((prev) => ({ ...prev, email: true }));
        } catch (err) {
          if (err.response?.status === 409) {
            setAvailability((prev) => ({ ...prev, email: false }));
          }
        }
      }, 500),
    [API]
  );

  // Debounced Username Checker
  const checkUsername = useMemo(
    () =>
      debounce(async (username) => {
        if (!username) return;
        try {
          await axios.get(`${API}/auth/username/${username}`);
          setAvailability((prev) => ({ ...prev, username: true }));
        } catch (err) {
          if (err.response?.status === 409) {
            setAvailability((prev) => ({ ...prev, username: false }));
          }
        }
      }, 500),
    [API]
  );

  // Trigger availability checks
  useEffect(() => {
    checkUsername(formData.username);
    checkEmail(formData.email);

    return () => {
      checkUsername.cancel();
      checkEmail.cancel();
    };
  }, [formData.username, formData.email, checkUsername, checkEmail]);

  // Validation
  const validate = () => {
    const err = {};

    if (!formData.username) err.username = "Username is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email))
      err.email = "Invalid email format";

    if (
      !formData.password.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/
      )
    )
      err.password =
        "Password must be 8+ chars, include upper, lower, number & symbol";

    if (formData.password !== formData.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    if (availability.email === false) err.email = "Email already registered";
    if (availability.username === false)
      err.username = "Username already taken";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // 1. Register
      await axios.post(
        `${API}/user/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // 2. Login immediately
      const res = await axios.post(`${API}/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      // 3. Store token and redirect
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration/Login failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <label>Username:</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        {availability.username === false && (
          <p className="error">Username already taken</p>
        )}
        {errors.username && <p className="error">{errors.username}</p>}

        {/* Email */}
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        {availability.email === false && (
          <p className="error">Email already registered</p>
        )}
        {errors.email && <p className="error">{errors.email}</p>}

        {/* Password */}
        <label>Password:</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <span className="toggle-eye" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        {/* Confirm Password */}
        <label>Confirm Password:</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
