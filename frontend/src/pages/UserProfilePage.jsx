import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { ArrowLeft, Star, GraduationCap, BookOpen, Video, FileText, User } from "lucide-react";

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    userService.getProfile(id)
      .then((data) => setUser(data.user))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
  if (!user) return <div className="page"><div className="empty-state">Loading...</div></div>;

  const teach = user.skills?.filter((s) => s.type === "teach") ?? [];
  const learn = user.skills?.filter((s) => s.type === "learn") ?? [];

  return (
    <div className="page">
      <div className="card card--wide" style={{ maxWidth: 560 }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div className="profile-header">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="profile-name">{user.name}</h1>
            {Number(user.rating_overall) > 0 && (
              <span className="profile-rating">
                <Star size={14} fill="currentColor" /> {Number(user.rating_overall).toFixed(1)} / 5
              </span>
            )}
          </div>
        </div>

        {user.bio && (
          <div className="section" style={{ marginTop: 0 }}>
            <div className="section-header">
              <FileText size={16} />
              <h2>About</h2>
            </div>
            <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.7, margin: 0 }}>{user.bio}</p>
          </div>
        )}

        <div className="section">
          <div className="section-header">
            <Video size={16} />
            <h2>Meeting Link</h2>
          </div>
          <a href={user.meeting_link} target="_blank" rel="noopener noreferrer" style={{ wordBreak: "break-all" }}>
            {user.meeting_link}
          </a>
        </div>

        {teach.length > 0 && (
          <div className="section">
            <div className="section-header">
              <GraduationCap size={16} />
              <h2>Can Teach</h2>
            </div>
            <div className="tiles-grid">
              {teach.map((s) => (
                <div className="tile" key={s.user_skill_id}>
                  <div className="tile-header">
                    <div className="tile-icon tile-icon--teach"><GraduationCap size={18} /></div>
                    <span className="badge badge-teach">Teach</span>
                  </div>
                  <div className="tile-title">{s.skill_name}</div>
                  <div className="tile-sub">{s.proficiency_level}</div>
                  {s.description && <div className="tile-desc">{s.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {learn.length > 0 && (
          <div className="section">
            <div className="section-header">
              <BookOpen size={16} />
              <h2>Wants to Learn</h2>
            </div>
            <div className="tiles-grid">
              {learn.map((s) => (
                <div className="tile" key={s.user_skill_id}>
                  <div className="tile-header">
                    <div className="tile-icon tile-icon--learn"><BookOpen size={18} /></div>
                    <span className="badge badge-learn">Learn</span>
                  </div>
                  <div className="tile-title">{s.skill_name}</div>
                  <div className="tile-sub">{s.proficiency_level}</div>
                  {s.description && <div className="tile-desc">{s.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
