import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from './pages/Register';
import Profile from "./pages/Profile";
import ChatWithMentor from "./pages/ChatWithMentor";
import ChatWithCounselor from "./pages/ChatWithCounselor";
import RequireAuth from "./utils/RequireAuth";
import LearningPathPage from "./pages/LearningPathPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/mentor" element={<RequireAuth><ChatWithMentor /></RequireAuth>} />
        <Route path="/counselor" element={<RequireAuth><ChatWithCounselor /></RequireAuth>} />
        <Route path="/learning-path" element={<RequireAuth><LearningPathPage /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;