import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const createLearningPath = async (career_path) => {
  try {
    const token = localStorage.getItem("token");
    return await axios.post(
      `${API_URL}/learning-path/`,
      { career_path },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error creating learning path:", error);
    throw error;
  }
};

export const getActivePaths = async () => {
  try {
    const token = localStorage.getItem("token");
    return await axios.get(`${API_URL}/learning-path/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching active learning paths:", error);
    throw error;
  }
};

export const getArchivedPaths = async () => {
  try {
    const token = localStorage.getItem("token");
    return await axios.get(`${API_URL}/learning-path/archived`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching archived learning paths:", error);
    throw error;
  }
};

export const updateLearningPath = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    return await axios.put(`${API_URL}/learning-path/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating learning path:", error);
    throw error;
  }
};

export const reactivatePath = async (id) => {
  try {
    const token = localStorage.getItem("token");
    return await axios.post(
      `${API_URL}/learning-path/${id}/reactivate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error reactivating learning path:", error);
    throw error;
  }
};