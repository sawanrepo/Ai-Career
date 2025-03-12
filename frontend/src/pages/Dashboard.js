import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Hello, Welcome to the Dashboard!</h2>
      <p>
        <Link to="/profile">View Profile.</Link>
      </p>
    </div>
  );
};

export default Dashboard;
