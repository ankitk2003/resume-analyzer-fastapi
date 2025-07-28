import "./summary.css"

const SummaryResult = ({ data }) => {
  if (!data || !data.analysis) return null

  const {
    strengths = [],
    weaknesses = [],
    overall_suggestions = [],
    job_role_suggestions = [],
  } = data.analysis

  const Section = ({ title, items }) => (
    <div className="section">
      <h3>{title}</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="summary-container">
      <h2>Resume Analysis Summary</h2>
      <Section title="💪 Strengths" items={strengths} />
      <Section title="⚠️ Weaknesses" items={weaknesses} />
      <Section title="✅ Suggestions" items={overall_suggestions} />
      <div className="section">
        <h3>🎯 Job Role Suggestions</h3>
        <div className="badge-group">
          {job_role_suggestions.map((role, idx) => (
            <span className="badge" key={idx}>{role}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SummaryResult
