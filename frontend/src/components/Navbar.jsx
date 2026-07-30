import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, RefreshCw, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <Sparkles size={20} />
          SkillBumble
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard" className={loc.pathname === "/dashboard" ? "active-link" : ""}>
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link to="/give-take" className={loc.pathname.startsWith("/give-take") ? "active-link" : ""}>
            <RefreshCw size={16} />
            Give &amp; Take
          </Link>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">{user.name}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
