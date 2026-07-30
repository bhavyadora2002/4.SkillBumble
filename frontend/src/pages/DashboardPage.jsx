import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, BookOpen, AlertCircle, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    refreshUser().catch(() => setError("Could not load your profile. Try logging in again."));
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
      <div className="card">
        <div className="card-header">
          <h1>Welcome, {user.name}</h1>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            <LogOut size={14} /> Log out
          </button>
        </div>

        {error && <div className="error-banner"><AlertCircle size={15} /> {error}</div>}

        <div className="section" style={{ marginTop: 0 }}>
          <div className="section-header">
            <GraduationCap size={18} />
            <h2>Skills you teach</h2>
          </div>
          {teach.length === 0 ? (
            <p className="empty-state" style={{ padding: "24px 16px" }}>You haven't added any teach skills yet.</p>
          ) : (
            <div className="tiles-grid">
              {teach.map((s) => (
                <div className="tile" key={s.user_skill_id}>
                  <div className="tile-header">
                    <div className="tile-icon tile-icon--teach">
                      <GraduationCap size={20} />
                    </div>
                    <span className="badge badge-teach">Teach</span>
                  </div>
                  <div className="tile-title">{s.skill_name}</div>
                  <div className="tile-sub">{s.proficiency_level}</div>
                  {s.description && <div className="tile-desc">{s.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <BookOpen size={18} />
            <h2>Skills you want to learn</h2>
          </div>
          {learn.length === 0 ? (
            <p className="empty-state" style={{ padding: "24px 16px" }}>You haven't added any learn skills yet.</p>
          ) : (
            <div className="tiles-grid">
              {learn.map((s) => (
                <div className="tile" key={s.user_skill_id}>
                  <div className="tile-header">
                    <div className="tile-icon tile-icon--learn">
                      <BookOpen size={20} />
                    </div>
                    <span className="badge badge-learn">Learn</span>
                  </div>
                  <div className="tile-title">{s.skill_name}</div>
                  <div className="tile-sub">{s.proficiency_level}</div>
                  {s.description && <div className="tile-desc">{s.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
