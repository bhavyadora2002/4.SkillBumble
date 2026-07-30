import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    refreshUser().catch(() => setError("Could not load your profile. Try logging in again."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const teach = user.skills?.filter((s) => s.type === "teach") ?? [];
  const learn = user.skills?.filter((s) => s.type === "learn") ?? [];

  return (
    <div className="page">
      <div className="card card--wide">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p className="subtitle">{user.email}</p>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="skill-section" style={{ borderTop: "none", paddingTop: 0 }}>
          <h2>Skills you teach</h2>
          {teach.length === 0 && <p className="empty-state">You haven't added any teach skills yet.</p>}
          <div className="skills-grid">
            {teach.map((s) => (
              <div className="skill-card" key={s.user_skill_id}>
                <strong>{s.skill_name}</strong> · {s.proficiency_level}
                {s.description && <p>{s.description}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="skill-section">
          <h2>Skills you want to learn</h2>
          {learn.length === 0 && <p className="empty-state">You haven't added any learn skills yet.</p>}
          <div className="skills-grid">
            {learn.map((s) => (
              <div className="skill-card" key={s.user_skill_id}>
                <strong>{s.skill_name}</strong> · {s.proficiency_level}
                {s.description && <p>{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
