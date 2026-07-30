import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Clock, User, Star, ExternalLink } from "lucide-react";

export default function MatchCard({ match, onRespond }) {
  const [loading, setLoading] = useState(null);
  const { other_user, post_title, post_skill_name, my_role, status, direction } = match;

  const handleRespond = async (action) => {
    setLoading(action);
    try {
      await onRespond(match.match_id, action);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="tile" style={{ background: direction === "incoming" ? "#fffbeb" : direction === "outgoing" ? "#eff6ff" : "#fff" }}>
      <div className="tile-header">
        <div className="tile-badges">
          <span className={`match-direction ${direction}`}>
            {direction === "incoming" ? "Incoming" : direction === "outgoing" ? "Sent" : "Confirmed"}
          </span>
          <span className={`badge ${status === "confirmed" ? "badge-success" : status === "cancelled" ? "badge-danger" : "badge-pending"}`}>
            {status}
          </span>
        </div>
      </div>
      <div className="tile-title" style={{ fontSize: 14, fontWeight: 500 }}>
        {post_title} &middot; {post_skill_name}
      </div>
      <div className="tile-desc" style={{ margin: "6px 0 8px", fontSize: 12 }}>
        {direction === "incoming" ? (
          my_role === "teach" ? "They want to learn this from you" : "They want to teach this to you"
        ) : direction === "outgoing" ? (
          my_role === "teach" ? "You offered to teach this" : "You want to learn this"
        ) : (
          my_role === "teach" ? "You are teaching this" : "You are learning this"
        )}
      </div>
      {other_user && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <Link to={`/users/${other_user.user_id}`} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            <User size={13} /> {other_user.name}
          </Link>
          {Number(other_user.rating_overall) > 0 && (
            <span style={{ fontSize: 12, color: "var(--warning)", display: "inline-flex", alignItems: "center", gap: 2 }}>
              <Star size={11} fill="currentColor" /> {Number(other_user.rating_overall).toFixed(1)}
            </span>
          )}
          {other_user.meeting_link && status === "confirmed" && (
            <a href={other_user.meeting_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <ExternalLink size={11} /> Meeting
            </a>
          )}
        </div>
      )}
      {other_user?.bio && status === "confirmed" && (
        <div className="tile-desc" style={{ marginTop: 6 }}>{other_user.bio}</div>
      )}
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        {direction === "incoming" && status === "pending" && (
          <>
            <button className="btn btn-success btn-sm" onClick={() => handleRespond("confirmed")} disabled={loading === "confirmed"}>
              {loading === "confirmed" ? "..." : <><Check size={13} /> Accept</>}
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleRespond("cancelled")} disabled={loading === "cancelled"}>
              {loading === "cancelled" ? "..." : <><X size={13} /> Reject</>}
            </button>
          </>
        )}
        {direction === "outgoing" && status === "pending" && (
          <span style={{ fontSize: 13, color: "var(--gray-400)", fontStyle: "italic", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Clock size={13} /> Waiting for response...
          </span>
        )}
        {status === "confirmed" && (
          <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>Matched!</span>
        )}
      </div>
    </div>
  );
}
