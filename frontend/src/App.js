import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from './pages/Register';
import Profile from "./pages/Profile";
import ChatWithMentor from "./pages/ChatWithMentor";
import ChatWithCounselor from "./pages/ChatWithCounselor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mentor" element={<ChatWithMentor />} />
        <Route path="/counselor" element={<ChatWithCounselor />} />
      </Routes>
    </Router>
  );
}

export default App;