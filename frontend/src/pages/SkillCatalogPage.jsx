import { useEffect, useState } from "react";
import { skillService } from "../services/skillService";

export default function SkillCatalogPage() {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    skillService.listSkills(query).then((data) => {
      setSkills(data.skills);
    }).catch(() => setError("Could not load skills."));
  }, [query]);

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="card card--wide">
        <h1>Skill Catalog</h1>
        <p className="subtitle">Browse skills available on the platform.</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="field">
          <input
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="skill-section">
            <h2>{category}</h2>
            <div className="skills-grid">
              {items.map((s) => (
                <div className="skill-card" key={s.skill_id}>
                  <strong>{s.skill_name}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && !error && (
          <p className="empty-state">No skills found.</p>
        )}
      </div>
    </div>
  );
}
