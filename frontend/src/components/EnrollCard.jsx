import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, User, CreditCard } from "lucide-react";

export default function EnrollCard({ post, onEnroll, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onEnroll(post.post_id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tile">
      <div className="tile-header">
        <div className="tile-icon tile-icon--teach">
          <GraduationCap size={20} />
        </div>
        <div className="tile-badges">
          <span className="badge badge-teach">Teach</span>
          <span className="tile-sub" style={{ textTransform: "capitalize" }}>{post.proficiency_level}</span>
        </div>
      </div>
      <div className="tile-title">{post.title}</div>
      <div className="tile-sub">
        <strong>{post.skill_name}</strong> &middot; {post.category}
      </div>
      <div className="tile-desc" style={{ margin: "6px 0 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
        <GraduationCap size={12} /> <Link to={`/users/${post.user_id}`} style={{ color: "var(--primary)", fontWeight: 500 }}>{post.user_name}</Link> is teaching this
      </div>
      {post.description && <div className="tile-desc">{post.description}</div>}
      <div className="tile-footer">
        <Link to={`/users/${post.user_id}`} className="post-user" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--primary)", fontSize: 13, fontWeight: 500 }}>
          <User size={13} /> {post.user_name}
        </Link>
        <button className={`btn ${disabled ? "btn-outline" : "btn-primary"} btn-sm`} onClick={handleClick} disabled={loading || disabled}>
          {loading ? "Enrolling..." : disabled ? "Enrolled" : <><CreditCard size={13} /> Enroll (1 Credit)</>}
        </button>
      </div>
    </div>
  );
}
