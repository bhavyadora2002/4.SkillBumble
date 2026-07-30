import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionService } from "../services/sessionService";
import { matchService } from "../services/matchService";
import { creditService } from "../services/creditService";

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    refreshUser().catch(() => setError("Could not load your profile. Try logging in again."));
    const token = localStorage.getItem("token");
    if (token) {
      sessionService.list(token).then((d) => setSessions(d.sessions || [])).catch(() => {});
      matchService.list(token).then((d) => setMatches(d.matches || [])).catch(() => {});
      creditService.getBalance(token).then((d) => setBalance(d.balance)).catch(() => {});
    }
  }, []);

  if (!user) return null;

  const teach = user.skills?.filter((s) => s.type === "teach") ?? [];
  const learn = user.skills?.filter((s) => s.type === "learn") ?? [];
  const upcoming = sessions.filter((s) => s.session_status === "scheduled");
  const pendingMatches = matches.filter((m) => m.match_status === "pending");

  return (
    <div className="page">
      <div className="card card--wide">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p className="subtitle">{user.email} &middot; {balance !== null ? `${balance} credits` : ""}</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div className="stat-card">
            <p className="stat-number">{upcoming.length}</p>
            <p className="stat-label">Upcoming Sessions</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{pendingMatches.length}</p>
            <p className="stat-label">Pending Matches</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{user.rating_overall || "-"}</p>
            <p className="stat-label">Rating</p>
          </div>
        </div>

        <div className="skill-section" style={{ borderTop: "none", paddingTop: 0 }}>
          <h2>Skills you teach</h2>
          {teach.length === 0 && <p className="empty-state">You haven't added any teach skills yet.</p>}
          <div className="skills-grid">
            {teach.map((s) => (
              <div className="skill-card" key={s.user_skill_id}>
                <strong>{s.skill_name}</strong> &middot; {s.proficiency_level}
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
                <strong>{s.skill_name}</strong> &middot; {s.proficiency_level}
                {s.description && <p>{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
