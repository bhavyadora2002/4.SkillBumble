import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { matchService } from "../services/matchService";

export default function MatchesPage() {
  const { token, user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState("matches");
  const [error, setError] = useState("");

  const loadMatches = () => {
    matchService.list(token).then((d) => setMatches(d.matches)).catch(() => setError("Could not load matches."));
  };

  const loadCandidates = () => {
    matchService.find(token).then((d) => setCandidates(d.candidates || [])).catch(() => setError("Could not find candidates."));
  };

  useEffect(() => {
    loadMatches();
    loadCandidates();
  }, []);

  const handleCreateMatch = async (candidate) => {
    setError("");
    const myTeachSkill = user.skills?.find(
      (s) => s.type === "teach" && candidate.complementary_skills?.some((cs) => cs.type === "learn" && cs.skill_id === s.skill_id)
    );
    const theirTeachSkill = candidate.complementary_skills?.find((cs) => cs.type === "learn");

    if (!myTeachSkill || !theirTeachSkill) {
      setError("No complementary skills found.");
      return;
    }

    try {
      await matchService.create({
        user_id: candidate.user_id,
        skill_i_teach: myTeachSkill.skill_id,
        they_teach: theirTeachSkill.skill_id,
      }, token);
      loadMatches();
      loadCandidates();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMatch = async (matchId, status) => {
    setError("");
    try {
      await matchService.update(matchId, { status }, token);
      loadMatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const otherUser = (match) => {
    return match.user1_id === user?.user_id
      ? { name: match.user2_name, email: match.user2_email, meeting_link: match.user2_meeting_link, rating: match.user2_rating }
      : { name: match.user1_name, email: match.user1_email, meeting_link: match.user1_meeting_link, rating: match.user1_rating };
  };

  return (
    <div className="page">
      <div className="card card--wide">
        <h1>Matches</h1>
        {error && <div className="error-banner">{error}</div>}

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className={`btn ${tab === "matches" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab("matches")}>
            My Matches ({matches.length})
          </button>
          <button className={`btn ${tab === "find" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab("find")}>
            Find Matches ({candidates.length})
          </button>
        </div>

        {tab === "matches" && (
          <>
            {matches.length === 0 && <p className="empty-state">No matches yet. Find a match to get started!</p>}
            {matches.map((m) => {
              const other = otherUser(m);
              return (
                <div key={m.match_id} className="skill-card" style={{ marginBottom: 12 }}>
                  <p><strong>{other.name}</strong> &middot; Rating: {other.rating || "N/A"}</p>
                  <p style={{ fontSize: 13, color: "#4b5563" }}>
                    You teach: {m.skill_from_user1_name} &harr; They teach: {m.skill_from_user2_name}
                  </p>
                  <p style={{ fontSize: 13 }}>Status: <strong>{m.match_status}</strong></p>
                  {m.match_status === "pending" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdateMatch(m.match_id, "confirmed")}>
                        Confirm
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleUpdateMatch(m.match_id, "cancelled")}>
                        Cancel
                      </button>
                    </div>
                  )}
                  {m.match_status === "confirmed" && (
                    <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => handleUpdateMatch(m.match_id, "completed")}>
                      Mark Completed
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}

        {tab === "find" && (
          <>
            {candidates.length === 0 && <p className="empty-state">No matching users found. Add more teach/learn skills to find matches.</p>}
            {candidates.map((c) => (
              <div key={c.user_id} className="skill-card" style={{ marginBottom: 12 }}>
                <p><strong>{c.name}</strong> &middot; Rating: {c.rating_overall || "N/A"}</p>
                <p style={{ fontSize: 13, color: "#4b5563" }}>{c.bio}</p>
                {c.complementary_skills && (
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    {c.complementary_skills.map((cs, i) => (
                      <span key={i}>
                        <span className={`skill-badge skill-badge--${cs.type}`}>{cs.type}</span> {cs.skill_name}
                        {" "}
                      </span>
                    ))}
                  </div>
                )}
                <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => handleCreateMatch(c)}>
                  Request Match
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
