import { useState } from "react";
import { createLearningPath } from "../services/learningPathAPI";
import "../styles/LearningPathForm.css";

export default function LearningPathForm({ onSuccess }) {
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createLearningPath(career);
      onSuccess();
      setCareer("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create path");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-box">
      <input
        className="career-input"
        type="text"
        value={career}
        placeholder="Enter a career goal (e.g., Data Scientist)"
        onChange={(e) => setCareer(e.target.value)}
      />
      <button className="generate-btn" onClick={handleCreate} disabled={loading}>
        {loading ? "Generating..." : "Generate Learning Path"}
      </button>
    </div>
  );
}