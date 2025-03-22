import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Hello, Welcome to the Dashboard! 👋</h2>

      <div className="dashboard-links">
        <Link to="/profile" className="dashboard-link">
          View Profile
        </Link>
        <Link to="/mentor" className="dashboard-link">
          Chat with Mentor
        </Link>
        <Link to="/counselor" className="dashboard-link">
          Chat with Counselor
        </Link>
        <Link to="/learning-path">
          <button className="your-progress-btn">📈 Your Progress</button>
        </Link>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
