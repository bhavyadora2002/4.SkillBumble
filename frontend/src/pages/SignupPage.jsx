import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkillPicker from "../components/SkillPicker";

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
        name,
        email,
        password,
        bio,
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
    <div className="page">
      <div className="card card--wide">
        <h1>Create your SkillBumble account</h1>
        <p className="subtitle">Tell us what you can teach and what you want to learn.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="meetingLink">Meeting link</label>
            <input
              id="meetingLink"
              placeholder="https://meet.jit.si/your-room"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
            />
          </div>

          <div className="skill-section">
            <h2>Your skills</h2>
            <p className="subtitle">Add anything you can teach and anything you'd like to learn.</p>
            <SkillPicker skills={skills} onChange={setSkills} />
          </div>

          <div style={{ marginTop: 24 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
