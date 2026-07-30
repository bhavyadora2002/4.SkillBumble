import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
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
          <LogIn size={22} /> Log in
        </h1>
        <p className="subtitle">Pick up where you left off.</p>

        {error && <div className="error-banner"><AlertCircle size={15} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email"><Mail size={13} /> Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="password"><Lock size={13} /> Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="footer-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
