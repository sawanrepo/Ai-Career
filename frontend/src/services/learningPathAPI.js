import axios from "../utils/axiosInstance";

export const createLearningPath = async (career_path) => {
  return await axios.post("/learning-path", { career_path });
};

export const getActivePaths = async () => {
  return await axios.get("/learning-path");
};

export const getArchivedPaths = async () => {
  return await axios.get("/learning-path/archived");
};

export const updateLearningPath = async (id, data) => {
  return await axios.put(`/learning-path/${id}`, data);
};

export const reactivatePath = async (id) => {
  return await axios.post(`/learning-path/${id}/reactivate`);
};