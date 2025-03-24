import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(res.data.username);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token, API_BASE]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-header">
        <h2>
          Hello, {username}! Welcome to <span className="brand">Scholra</span> 👋
        </h2>
        <div className="dashboard-controls">
          <button onClick={toggleDarkMode} className="toggle-dark">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/profile" className="dashboard-card">
          <img src="/images/profile-icon.png" alt="Profile" className="card-icon" />
          <p>View Profile</p>
        </Link>

        <Link to="/mentor" className="dashboard-card">
          <img src="/images/mentor-bot.png" alt="Mentor" className="card-icon" />
          <p>Chat with Mentor</p>
        </Link>

        <Link to="/counselor" className="dashboard-card">
          <img src="/images/counselor-bot.png" alt="Counselor" className="card-icon" />
          <p>Chat with Counselor</p>
        </Link>

        <Link to="/learning-path" className="dashboard-card">
          <img src="/images/progress-chart.png" alt="Progress" className="card-icon" />
          <p>Your Progress</p>
        </Link>

        <Link to="/interviewer" className="dashboard-card">
          <img src="/images/interview-bot.png" alt="Mock Interview" className="card-icon" />
          <p>Mock Interview</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;