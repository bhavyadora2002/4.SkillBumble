import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sessionService } from "../services/sessionService";
import { matchService } from "../services/matchService";

export default function SessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [confirmedMatches, setConfirmedMatches] = useState([]);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ match_id: "", scheduled_time: "", duration: 60 });

  const load = () => {
    sessionService.list(token).then((d) => setSessions(d.sessions)).catch(() => setError("Could not load sessions."));
    matchService.list(token).then((d) => {
      setConfirmedMatches((d.matches || []).filter((m) => m.match_status === "confirmed"));
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await sessionService.create({
        match_id: form.match_id,
        scheduled_time: form.scheduled_time,
        duration: parseInt(form.duration),
      }, token);
      setShowCreate(false);
      setForm({ match_id: "", scheduled_time: "", duration: 60 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (sessionId, status) => {
    setError("");
    try {
      await sessionService.update(sessionId, { status }, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const grouped = {
    scheduled: sessions.filter((s) => s.session_status === "scheduled" || s.session_status === "in_progress"),
    completed: sessions.filter((s) => s.session_status === "completed"),
    cancelled: sessions.filter((s) => s.session_status === "cancelled"),
  };

  return (
    <div className="page">
      <div className="card card--wide">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Sessions</h1>
          <button className="btn btn-secondary" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "Cancel" : "+ Schedule"}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showCreate && (
          <form onSubmit={handleCreate} style={{ marginBottom: 24, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
            <div className="field">
              <label>Match</label>
              <select value={form.match_id} onChange={(e) => setForm({ ...form, match_id: e.target.value })} required>
                <option value="">Select a confirmed match</option>
                {confirmedMatches.map((m) => (
                  <option key={m.match_id} value={m.match_id}>
                    {m.user1_name} &harr; {m.user2_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="field">
                <label>Scheduled time</label>
                <input type="datetime-local" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} required />
              </div>
              <div className="field">
                <label>Duration (min)</label>
                <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} min={15} max={480} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Session</button>
          </form>
        )}

        {Object.entries(grouped).map(([status, items]) => (
          <div key={status} className="skill-section">
            <h2 style={{ textTransform: "capitalize" }}>{status} ({items.length})</h2>
            {items.length === 0 && <p className="empty-state">No {status} sessions.</p>}
            {items.map((s) => (
              <div key={s.session_id} className="skill-card" style={{ marginBottom: 8 }}>
                <p><strong>{s.teacher_name}</strong> teaching <strong>{s.learner_name}</strong></p>
                <p style={{ fontSize: 13, color: "#4b5563" }}>
                  {new Date(s.scheduled_time).toLocaleString()} &middot; {s.duration} min
                </p>
                {s.session_status === "scheduled" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdate(s.session_id, "completed")}>
                      Mark Completed
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleUpdate(s.session_id, "cancelled")}>
                      Cancel
                    </button>
                  </div>
                )}
                {s.teacher_meeting_link && (
                  <p style={{ fontSize: 13, marginTop: 4 }}>
                    Meeting: <a href={s.teacher_meeting_link} target="_blank" rel="noreferrer">{s.teacher_meeting_link}</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
