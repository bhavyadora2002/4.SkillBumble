import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sessionService } from "../services/sessionService";
import { ratingService } from "../services/ratingService";

export default function RatingPage() {
  const { token } = useAuth();
  const [unrated, setUnrated] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ session_id: "", score: 5, comment: "" });

  const load = () => {
    sessionService.unrated(token).then((d) => setUnrated(d.sessions)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await ratingService.create(form, token);
      setSuccess("Rating submitted!");
      setForm({ session_id: "", score: 5, comment: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Rate a Session</h1>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Session</label>
            <select value={form.session_id} onChange={(e) => setForm({ ...form, session_id: e.target.value })} required>
              <option value="">Select a completed session</option>
              {unrated.map((s) => (
                <option key={s.session_id} value={s.session_id}>
                  {s.teacher_name} & {s.learner_name} - {new Date(s.scheduled_time).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Score (1-5)</label>
            <select value={form.score} onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Comment (optional)</label>
            <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!form.session_id}>
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
}
