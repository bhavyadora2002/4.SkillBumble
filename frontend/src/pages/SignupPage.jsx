import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkillPicker from "../components/SkillPicker";
import { UserPlus, User, Mail, Lock, FileText, Video, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name, email, password, bio,
        meeting_link: meetingLink,
        skills: skills.map(({ skill_name, ...rest }) => rest),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <div className="card">
        <h1 style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <UserPlus size={22} /> Sign up
        </h1>
        <p className="subtitle">Tell us what you can teach and what you want to learn.</p>

        {error && <div className="error-banner"><AlertCircle size={15} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name"><User size={13} /> Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="email"><Mail size={13} /> Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field--row">
            <div className="field">
              <label htmlFor="password"><Lock size={13} /> Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword"><Lock size={13} /> Confirm</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="bio"><FileText size={13} /> Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell others about yourself..." />
          </div>

          <div className="field">
            <label htmlFor="meetingLink"><Video size={13} /> Meeting link</label>
            <input id="meetingLink" placeholder="https://meet.jit.si/your-room" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} required />
          </div>

          <div className="section" style={{ marginTop: 24 }}>
            <div className="section-header">
              <h2>Your skills</h2>
            </div>
            <SkillPicker skills={skills} onChange={setSkills} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }} disabled={submitting}>
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
