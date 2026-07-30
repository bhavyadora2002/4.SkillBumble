import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { creditService } from "../services/creditService";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (token) {
      creditService.getBalance(token).then((d) => setBalance(d.balance)).catch(() => {});
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">SkillBumble</Link>
        <div className="navbar-links">
          <Link to="/skills">Skills</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/posts">Posts</Link>
          <Link to="/profile">Profile</Link>
          {balance !== null && <span className="navbar-credits">{balance} credits</span>}
          <span className="navbar-user">{user?.name}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </nav>
  );
}
