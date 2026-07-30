import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { skillService } from "../services/skillService";
import { postService } from "../services/postService";
import { Plus, BookOpen, GraduationCap, Type, FileText, Tag, AlertCircle, ArrowLeft } from "lucide-react";

const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState([]);
  const [skillId, setSkillId] = useState("");
  const [type, setType] = useState("teach");
  const [proficiency, setProficiency] = useState("beginner");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    skillService.listSkills().then((data) => {
      setCatalog(data.skills);
      if (data.skills.length) setSkillId(data.skills[0].skill_id);
    }).catch(() => setError("Could not load skill catalog."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    try {
      await postService.createPost({ skill_id: skillId, type, proficiency_level: proficiency, title, description });
      navigate("/give-take");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 560 }}>
        <button className="btn btn-ghost" onClick={() => navigate("/give-take")} style={{ marginBottom: 12 }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Plus size={22} /> New Offer
        </h1>
        <p className="subtitle">Offer a skill you can teach, or ask for one you want to learn.</p>

        {error && <div className="error-banner"><AlertCircle size={15} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title"><Type size={13} /> Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Learn Python from a pro" required />
          </div>

          <div className="field--row">
            <div className="field">
              <label htmlFor="skill"><Tag size={13} /> Skill</label>
              <select id="skill" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
                {catalog.map((s) => (
                  <option key={s.skill_id} value={s.skill_id}>{s.skill_name} ({s.category})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="type">{type === "teach" ? <GraduationCap size={13} /> : <BookOpen size={13} />} I want to</label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="teach">Teach this</option>
                <option value="learn">Learn this</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="proficiency"><GraduationCap size={13} /> Level</label>
              <select id="proficiency" value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
                {PROFICIENCY_LEVELS.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="desc"><FileText size={13} /> Description (optional)</label>
            <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you're offering or looking for..." />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating..." : <><Plus size={15} /> Create Offer</>}
          </button>
        </form>
      </div>
    </div>
  );
}
