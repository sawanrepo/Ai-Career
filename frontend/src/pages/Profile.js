import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProfilePage.css';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });


        const user = res.data;
        const userProfile = {
          name: user.username,
          email: user.email,
          ...user.profile 
        };

        setProfile(userProfile);
        setFormData(userProfile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "skills" || name === "interests" ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      skills: formData.skills,
      interests: formData.interests,
      education: formData.education,
      goals: formData.goals
    };

    try {
      await axios.put('http://localhost:8000/profile/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProfile({ ...profile, ...payload });
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Unable to load profile.</p>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      {!editing ? (
        <div className="profile-card">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Skills:</strong> {profile.skills?.join(', ')}</p>
          <p><strong>Interests:</strong> {profile.interests?.join(', ')}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Goals:</strong> {profile.goals}</p>
          <button className="profile-button" onClick={() => setEditing(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-card">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <label>Skills (comma-separated):</label>
          <input name="skills" value={formData.skills?.join(',') || ''} onChange={handleChange} />

          <label>Interests (comma-separated):</label>
          <input name="interests" value={formData.interests?.join(',') || ''} onChange={handleChange} />

          <label>Education:</label>
          <input name="education" value={formData.education || ''} onChange={handleChange} />

          <label>Goals:</label>
          <input name="goals" value={formData.goals || ''} onChange={handleChange} />

          <button type="submit" className="profile-button">Save</button>
          <button type="button" className="profile-cancel-button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
      <div className="back-button-container">
        <Link to="/dashboard">
          <button className="back-btn">🔙 Back to Dashboard 🚀</button>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;