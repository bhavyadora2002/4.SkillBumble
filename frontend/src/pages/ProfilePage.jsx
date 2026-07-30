import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import SkillPicker from "../components/SkillPicker";

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setMeetingLink(user.meeting_link || "");
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.updateMe({ name, bio, location, meeting_link: meetingLink }, token);
      await refreshUser();
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSkills = async () => {
    setError("");
    if (skills.length === 0) return;
    const latest = skills[skills.length - 1];
    if (!latest.skill_id) return;
    try {
      await api.addSkill({
        skill_id: latest.skill_id,
        type: latest.type,
        proficiency_level: latest.proficiency_level,
        description: latest.description,
      }, token);
      await refreshUser();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveSkill = async (userSkillId) => {
    setError("");
    try {
      await api.removeSkill(userSkillId, token);
      await refreshUser();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return null;

  const currentSkills = skills.map((s) => ({
    skill_id: s.skill_id,
    skill_name: s.skill_name,
    type: s.type,
    proficiency_level: s.proficiency_level,
    description: s.description,
    user_skill_id: s.user_skill_id,
  }));

  return (
    <div className="page">
      <div className="card card--wide">
        <h1>Edit Profile</h1>
        <p className="subtitle">{user.email}</p>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleUpdateProfile}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="meetingLink">Meeting link</label>
            <input id="meetingLink" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <div className="skill-section">
          <h2>Your Skills</h2>
          {currentSkills.length > 0 && (
            <ul className="skill-list">
              {currentSkills.map((s) => (
                <li key={s.user_skill_id}>
                  <div className="skill-meta">
                    <span className={`skill-badge skill-badge--${s.type}`}>{s.type}</span>
                    <strong>{s.skill_name}</strong> &middot; {s.proficiency_level}
                    {s.description && <p style={{ margin: "4px 0 0" }}>{s.description}</p>}
                  </div>
                  <button type="button" className="btn-danger-ghost" onClick={() => handleRemoveSkill(s.user_skill_id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <SkillPicker skills={[]} onChange={(newSkills) => {
            if (newSkills.length > 0) {
              setSkills(newSkills);
              handleAddSkills();
            }
          }} />
        </div>

        <p style={{ marginTop: 16 }}>
          <strong>Rating:</strong> {user.rating_overall || "No ratings yet"} &middot;
          <strong> Credits:</strong> {user.credit_balance || 0}
        </p>
      </div>
    </div>
  );
}
