import { useEffect, useState } from "react";
import { skillService } from "../services/skillService";

const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

export default function SkillPicker({ skills, onChange }) {
  const [catalog, setCatalog] = useState([]);
  const [skillId, setSkillId] = useState("");
  const [type, setType] = useState("teach");
  const [proficiency, setProficiency] = useState("beginner");
  const [description, setDescription] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    skillService
      .listSkills()
      .then((data) => {
        setCatalog(data.skills);
        if (data.skills.length) setSkillId(data.skills[0].skill_id);
      })
      .catch(() => setLoadError("Could not load the skill catalog."));
  }, []);

  const addSkill = () => {
    if (!skillId) return;
    const catalogSkill = catalog.find((s) => s.skill_id === skillId);
    onChange([
      ...skills,
      {
        skill_id: skillId,
        skill_name: catalogSkill?.skill_name,
        type,
        proficiency_level: proficiency,
        description,
      },
    ]);
    setDescription("");
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  if (loadError) return <p className="error-banner">{loadError}</p>;

  return (
    <div>
      {skills.length > 0 && (
        <ul className="skill-list">
          {skills.map((s, i) => (
            <li key={i}>
              <div className="skill-meta">
                <span className={`skill-badge skill-badge--${s.type}`}>{s.type}</span>
                <strong>{s.skill_name}</strong> · {s.proficiency_level}
                {s.description && <p style={{ margin: "4px 0 0" }}>{s.description}</p>}
              </div>
              <button type="button" className="btn-danger-ghost" onClick={() => removeSkill(i)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="skill-picker-form">
        <select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
          {catalog.map((s) => (
            <option key={s.skill_id} value={s.skill_id}>
              {s.skill_name} ({s.category})
            </option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="teach">I can teach this</option>
          <option value="learn">I want to learn this</option>
        </select>

        <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
          {PROFICIENCY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Describe your experience with this skill (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="button" className="btn btn-secondary" onClick={addSkill}>
        + Add skill
      </button>
    </div>
  );
}
