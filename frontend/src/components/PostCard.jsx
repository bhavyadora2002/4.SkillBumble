import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Send, User } from "lucide-react";

export default function PostCard({ post, onRequestMatch, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onRequestMatch(post.post_id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tile">
      <div className="tile-header">
        <div className={`tile-icon ${post.type === "teach" ? "tile-icon--teach" : "tile-icon--learn"}`}>
          {post.type === "teach" ? <GraduationCap size={20} /> : <BookOpen size={20} />}
        </div>
        <div className="tile-badges">
          <span className={`badge ${post.type === "teach" ? "badge-teach" : "badge-learn"}`}>
            {post.type === "teach" ? "Teach" : "Learn"}
          </span>
          <span className="tile-sub" style={{ textTransform: "capitalize" }}>{post.proficiency_level}</span>
        </div>
      </div>
      <div className="tile-title">{post.title}</div>
      <div className="tile-sub">
        <strong>{post.skill_name}</strong> &middot; {post.category}
      </div>
      <div className="tile-desc" style={{ margin: "6px 0 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
        {post.type === "teach" ? (
          <><GraduationCap size={12} /> <Link to={`/users/${post.user_id}`} style={{ color: "var(--primary)", fontWeight: 500 }}>{post.user_name}</Link> is teaching this</>
        ) : (
          <><BookOpen size={12} /> <Link to={`/users/${post.user_id}`} style={{ color: "var(--primary)", fontWeight: 500 }}>{post.user_name}</Link> wants to learn this</>
        )}
      </div>
      {post.description && <div className="tile-desc">{post.description}</div>}
      <div className="tile-footer">
        <Link to={`/users/${post.user_id}`} className="post-user" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--primary)", fontSize: 13, fontWeight: 500 }}>
          <User size={13} /> {post.user_name}
        </Link>
        <button className={`btn ${disabled ? "btn-outline" : "btn-primary"} btn-sm`} onClick={handleClick} disabled={loading || disabled}>
          {loading ? "Sending..." : disabled ? "Requested" : <><Send size={13} /> Request Match</>}
        </button>
      </div>
    </div>
  );
}
