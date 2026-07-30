import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/postService";
import { matchService } from "../services/matchService";
import PostCard from "../components/PostCard";
import MatchCard from "../components/MatchCard";
import { Compass, MessageSquare, HandshakeIcon, Plus, Star, ExternalLink, RefreshCw } from "lucide-react";

export default function GiveTakePage() {
  const [posts, setPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [requested, setRequested] = useState(new Set());
  const [error, setError] = useState("");
  const [tab, setTab] = useState("browse");

  const load = useCallback(async () => {
    setError("");
    try {
      const [pData, mData] = await Promise.all([
        postService.listPosts(),
        matchService.listMatches(),
      ]);
      setPosts(pData.posts || []);
      setMatches(mData.matches || []);
      const req = new Set(
        (mData.matches || [])
          .filter((m) => m.direction === "outgoing" || m.direction === "confirmed")
          .map((m) => m.post_id)
      );
      setRequested(req);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRequestMatch = async (postId) => {
    await matchService.requestMatch({ post_id: postId });
    setRequested((prev) => new Set(prev).add(postId));
    await load();
  };

  const handleRespond = async (matchId, status) => {
    await matchService.updateMatch(matchId, status);
    await load();
  };

  if (error) return <div className="page"><div className="error-banner">{error}</div></div>;

  const incoming = matches.filter((m) => m.direction === "incoming" && m.status === "pending");
  const outgoing = matches.filter((m) => m.direction === "outgoing" && m.status === "pending");
  const matched = matches.filter((m) => m.status === "confirmed");

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h1><RefreshCw size={22} /> Give &amp; Take</h1>
          <Link to="/give-take/create" className="btn btn-primary btn-sm">
            <Plus size={15} /> New Offer
          </Link>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === "browse" ? "tab-active" : ""}`} onClick={() => setTab("browse")}>
            <Compass size={15} /> Browse
          </button>
          <button className={`tab ${tab === "matches" ? "tab-active" : ""}`} onClick={() => setTab("matches")}>
            <MessageSquare size={15} /> My Matches
            {(incoming.length + outgoing.length) > 0 && <span className="tab-badge">{incoming.length + outgoing.length}</span>}
          </button>
          <button className={`tab ${tab === "matched" ? "tab-active" : ""}`} onClick={() => setTab("matched")}>
            <HandshakeIcon size={15} /> Matched
            {matched.length > 0 && <span className="tab-badge tab-badge-success">{matched.length}</span>}
          </button>
        </div>

        {tab === "browse" && (
          posts.length === 0 ? (
            <div className="empty-state">
              <Compass size={40} />
              No open offers yet. Be the first to create one!
            </div>
          ) : (
            <div className="tiles-grid">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} onRequestMatch={handleRequestMatch} disabled={requested.has(post.post_id)} />
              ))}
            </div>
          )
        )}

        {tab === "matches" && (
          incoming.length === 0 && outgoing.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={40} />
              No pending matches. Check the Matched tab for confirmed ones!
            </div>
          ) : (
            <div className="matches-list">
              {incoming.length > 0 && (
                <>
                  <h3 className="match-section-title">Incoming Requests</h3>
                  {incoming.map((m) => <MatchCard key={m.match_id} match={m} onRespond={handleRespond} />)}
                </>
              )}
              {outgoing.length > 0 && (
                <>
                  <h3 className="match-section-title" style={{ marginTop: 8 }}>My Requests</h3>
                  {outgoing.map((m) => <MatchCard key={m.match_id} match={m} onRespond={handleRespond} />)}
                </>
              )}
            </div>
          )
        )}

        {tab === "matched" && (
          matched.length === 0 ? (
            <div className="empty-state">
              <HandshakeIcon size={40} />
              No confirmed matches yet. Accept an incoming request to see it here!
            </div>
          ) : (
            <div className="matched-grid">
              {matched.map((m) => (
                <div className="tile" key={m.match_id} style={{ borderColor: "var(--success-border)", background: "var(--success-bg)" }}>
                  <div className="tile-header">
                    <div className="tile-badges">
                      <span className="badge badge-success"><HandshakeIcon size={11} /> Matched</span>
                    </div>
                    <div className="tile-sub">{m.post_title} &middot; {m.post_skill_name}</div>
                  </div>
                  {m.other_user && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span className={`badge ${m.my_role === "teach" ? "badge-teach" : "badge-learn"}`}>
                          {m.my_role === "teach" ? "Teach" : "Learn"}
                        </span>
                        <span style={{ fontSize: 14 }}>{m.post_skill_name}</span>
                        <span style={{ color: "var(--gray-400)", fontSize: 13 }}>with</span>
                        <Link to={`/users/${m.other_user.user_id}`} style={{ fontSize: 16, fontWeight: 700 }}>
                          {m.other_user.name}
                        </Link>
                        {Number(m.other_user.rating_overall) > 0 && (
                          <span style={{ color: "var(--warning)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 3 }}>
                            <Star size={13} fill="currentColor" /> {Number(m.other_user.rating_overall).toFixed(1)}
                          </span>
                        )}
                      </div>
                      {m.other_user.bio && <div className="tile-desc">{m.other_user.bio}</div>}
                      {m.other_user.skills && m.other_user.skills.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0" }}>
                          {m.other_user.skills.map((s) => (
                            <span key={s.user_skill_id} className="skill-tag">{s.skill_name}</span>
                          ))}
                        </div>
                      )}
                      {m.other_user.meeting_link && (
                        <a href={m.other_user.meeting_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: 8, width: "auto", display: "inline-flex" }}>
                          <ExternalLink size={14} /> Join Meeting
                        </a>
                      )}
                    </div>
                  )}
                  <div className="tile-footer" style={{ borderTopColor: "var(--success-border)", marginTop: 14 }}>
                    <span style={{ color: "#15803d", fontSize: 13, fontWeight: 600 }}>You are matched!</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
