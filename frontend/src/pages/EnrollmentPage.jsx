import { useCallback, useEffect, useState } from "react";
import { enrollmentService } from "../services/enrollmentService";
import { useAuth } from "../context/AuthContext";
import EnrollCard from "../components/EnrollCard";
import { Compass, BookOpen, GraduationCap, Star, ExternalLink, CreditCard, User, CheckCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnrollmentPage() {
  const { user, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [error, setError] = useState("");
  const [tab, setTab] = useState("browse");

  const load = useCallback(async () => {
    setError("");
    try {
      const [pData, eData, sData] = await Promise.all([
        enrollmentService.listEnrollmentPosts(),
        enrollmentService.listMyEnrollments(),
        enrollmentService.listMyStudents(),
      ]);
      setPosts(pData.posts || []);
      setEnrollments(eData.enrollments || []);
      setStudents(sData.students || []);
      const ids = new Set((eData.enrollments || []).map((e) => e.post_id));
      setEnrolledIds(ids);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (postId) => {
    try {
      await enrollmentService.enroll(postId);
      setEnrolledIds((prev) => new Set(prev).add(postId));
      await refreshUser();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="page"><div className="error-banner">{error}</div></div>;

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h1><CreditCard size={22} /> Credit Enrollment</h1>
          {user && (
            <span className="credit-badge">
              <CreditCard size={14} /> {Number(user.credit_balance || 0).toFixed(2)} Credits
            </span>
          )}
        </div>

        <div className="tabs">
          <button className={`tab ${tab === "browse" ? "tab-active" : ""}`} onClick={() => setTab("browse")}>
            <Compass size={15} /> Browse
          </button>
          <button className={`tab ${tab === "enrolled" ? "tab-active" : ""}`} onClick={() => setTab("enrolled")}>
            <BookOpen size={15} /> Enrolled
            {enrollments.length > 0 && <span className="tab-badge tab-badge-success">{enrollments.length}</span>}
          </button>
          <button className={`tab ${tab === "students" ? "tab-active" : ""}`} onClick={() => setTab("students")}>
            <Users size={15} /> My Students
            {students.length > 0 && <span className="tab-badge tab-badge-success">{students.length}</span>}
          </button>
        </div>

        {tab === "browse" && (
          posts.length === 0 ? (
            <div className="empty-state">
              <Compass size={40} />
              No teach offers available for enrollment right now.
            </div>
          ) : (
            <div className="tiles-grid">
              {posts.map((post) => (
                <EnrollCard key={post.post_id} post={post} onEnroll={handleEnroll} disabled={enrolledIds.has(post.post_id)} />
              ))}
            </div>
          )
        )}

        {tab === "enrolled" && (
          enrollments.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={40} />
              You haven't enrolled in any courses yet. Browse available offers to get started!
            </div>
          ) : (
            <div className="enrolled-list">
              {enrollments.map((e) => (
                <div className="tile enrolled-tile" key={e.enrollment_id}>
                  <div className="tile-header">
                    <div className="tile-badges">
                      <span className={`badge ${e.status === "enrolled" ? "badge-success" : e.status === "completed" ? "badge-teach" : "badge-danger"}`}>
                        {e.status === "enrolled" ? "Active" : e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                      {e.status === "enrolled" && <CheckCircle size={15} style={{ color: "var(--success)" }} />}
                    </div>
                    <span className="tile-sub" style={{ fontSize: 12 }}>Paid: {Number(e.credits_paid).toFixed(2)} credit(s)</span>
                  </div>
                  <div className="tile-title">{e.title}</div>
                  <div className="tile-sub">
                    <strong>{e.skill_name}</strong> &middot; {e.category}
                  </div>
                  {e.description && <div className="tile-desc">{e.description}</div>}
                  <div className="tile-desc" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <GraduationCap size={13} /> Teacher:
                    <Link to={`/users/${e.teacher_id}`} style={{ fontWeight: 600, color: "var(--primary)" }}>
                      {e.teacher_name}
                    </Link>
                    {Number(e.teacher_rating) > 0 && (
                      <span style={{ color: "var(--warning)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <Star size={12} fill="currentColor" /> {Number(e.teacher_rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="tile-footer">
                    <span style={{ fontSize: 12, color: "var(--gray-400)" }}>
                      Enrolled {new Date(e.created_at).toLocaleDateString()}
                    </span>
                    {e.meeting_link && (
                      <a href={e.meeting_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        <ExternalLink size={13} /> Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === "students" && (
          students.length === 0 ? (
            <div className="empty-state">
              <Users size={40} />
              No students have enrolled in your posts yet.
            </div>
          ) : (
            <div className="enrolled-list">
              {students.map((s) => (
                <div className="tile" key={s.enrollment_id} style={{ borderLeft: "3px solid var(--primary)" }}>
                  <div className="tile-header">
                    <div className="tile-badges">
                      <span className={`badge ${s.status === "enrolled" ? "badge-success" : s.status === "completed" ? "badge-teach" : "badge-danger"}`}>
                        {s.status === "enrolled" ? "Active" : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </div>
                    <span className="tile-sub" style={{ fontSize: 12 }}>
                      Paid: {Number(s.credits_paid).toFixed(2)} credit(s) &middot; {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="tile-title">{s.title}</div>
                  <div className="tile-sub">
                    <strong>{s.skill_name}</strong> &middot; {s.category}
                  </div>
                  {s.description && <div className="tile-desc">{s.description}</div>}
                  <div className="tile-desc" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <User size={13} /> Student:
                    <Link to={`/users/${s.learner_id || s.teacher_id}`} style={{ fontWeight: 600, color: "var(--primary)" }}>
                      {s.learner_name}
                    </Link>
                    {Number(s.learner_rating) > 0 && (
                      <span style={{ color: "var(--warning)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <Star size={12} fill="currentColor" /> {Number(s.learner_rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="tile-footer">
                    {s.learner_meeting_link && (
                      <a href={s.learner_meeting_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        <ExternalLink size={13} /> Join Meeting
                      </a>
                    )}
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
