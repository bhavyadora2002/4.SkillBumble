import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/postService";
import { sessionService } from "../services/sessionService";
import { skillService } from "../services/skillService";

export default function PostsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [tab, setTab] = useState("browse");
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [form, setForm] = useState({ skill_id: "", title: "", description: "" });
  const [enrollForm, setEnrollForm] = useState({ post_id: "", scheduled_time: "" });

  const load = () => {
    postService.list().then((d) => setPosts(d.posts)).catch(() => {});
    if (token) {
      postService.listMine(token).then((d) => setMyPosts(d.posts)).catch(() => {});
    }
    skillService.listSkills().then((d) => setCatalog(d.skills)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await postService.create(form, token);
      setShowCreate(false);
      setForm({ skill_id: "", title: "", description: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await sessionService.create({
        post_id: enrollForm.post_id,
        scheduled_time: enrollForm.scheduled_time,
        duration: 60,
      }, token);
      setEnrollForm({ post_id: "", scheduled_time: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePost = async (postId, status) => {
    setError("");
    try {
      await postService.update(postId, { status }, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card card--wide">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Skill Posts (EarnCredits)</h1>
          {token && (
            <button className="btn btn-secondary" onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? "Cancel" : "+ New Post"}
            </button>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showCreate && (
          <form onSubmit={handleCreate} style={{ marginBottom: 24, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
            <div className="field">
              <label>Skill</label>
              <select value={form.skill_id} onChange={(e) => setForm({ ...form, skill_id: e.target.value })} required>
                <option value="">Select a skill</option>
                {catalog.map((s) => (
                  <option key={s.skill_id} value={s.skill_id}>{s.skill_name} ({s.category})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Create Post</button>
          </form>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className={`btn ${tab === "browse" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab("browse")}>
            Browse ({posts.length})
          </button>
          {token && (
            <button className={`btn ${tab === "mine" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab("mine")}>
              My Posts ({myPosts.length})
            </button>
          )}
        </div>

        {tab === "browse" && (
          <>
            {posts.length === 0 && <p className="empty-state">No active posts. Be the first to create one!</p>}
            {posts.map((p) => (
              <div key={p.post_id} className="skill-card" style={{ marginBottom: 12 }}>
                <p><strong>{p.title}</strong></p>
                <p style={{ fontSize: 13, color: "#4b5563" }}>
                  By {p.user_name} &middot; {p.skill_name} &middot; {p.learner_count || 0} learners
                </p>
                {p.description && <p style={{ fontSize: 13 }}>{p.description}</p>}
                {token && (
                  <>
                    {enrollForm.post_id === p.post_id ? (
                      <form onSubmit={handleEnroll} style={{ marginTop: 8 }}>
                        <input type="hidden" value={p.post_id} />
                        <div className="field">
                          <label>Pick a time</label>
                          <input type="datetime-local" value={enrollForm.scheduled_time} onChange={(e) => setEnrollForm({ post_id: p.post_id, scheduled_time: e.target.value })} required />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button type="submit" className="btn btn-primary">Enroll</button>
                          <button type="button" className="btn btn-ghost" onClick={() => setEnrollForm({ post_id: "", scheduled_time: "" })}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => setEnrollForm({ post_id: p.post_id, scheduled_time: "" })}>
                        Enroll
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "mine" && (
          <>
            {myPosts.length === 0 && <p className="empty-state">You haven't created any posts.</p>}
            {myPosts.map((p) => (
              <div key={p.post_id} className="skill-card" style={{ marginBottom: 12 }}>
                <p><strong>{p.title}</strong></p>
                <p style={{ fontSize: 13, color: "#4b5563" }}>
                  {p.skill_name} &middot; {p.learner_count || 0} learners &middot; Status: {p.status}
                </p>
                {p.status === "active" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn btn-secondary" onClick={() => handleUpdatePost(p.post_id, "completed")}>
                      Mark Completed
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleUpdatePost(p.post_id, "cancelled")}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
