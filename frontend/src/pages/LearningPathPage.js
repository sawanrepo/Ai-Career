import { useEffect, useState } from "react";
import { getActivePaths } from "../services/learningPathAPI";
import LearningPathCard from "../components/LearningPathCard";
import LearningPathForm from "../components/LearningPathForm";
import "../styles/LearningPathPage.css";

export default function LearningPathPage() {
  const [paths, setPaths] = useState([]);

  const fetchPaths = async () => {
    try {
      const res = await getActivePaths();
      setPaths(res.data);
    } catch (err) {
      alert("Failed to load learning paths.");
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  return (
    <div className="learning-page">
      <h1 className="page-title">Your Learning Paths</h1>
      <LearningPathForm onSuccess={fetchPaths} />
      <div className="cards-container">
        {paths.map((path) => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}