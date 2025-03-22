import "../styles/LearningPathCard.css";

export default function LearningPathCard({ path }) {
  return (
    <div className="card">
      <h2>{path.career_path}</h2>
      <p>{path.is_completed ? "✅ Completed" : "🕓 In Progress"}</p>
      <ol>
        {path.steps.map((step, i) => (
          <li key={i} className="step">
            <strong>{step.title}</strong>
            <p>{step.description}</p>
            <ul className="resources">
              {step.resources?.map((res, j) => (
                <li key={j}>
                  <a href={res.url} target="_blank" rel="noreferrer">
                    {res.title} ({res.type})
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}