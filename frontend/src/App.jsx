import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SkillCatalogPage from "./pages/SkillCatalogPage";
import MatchesPage from "./pages/MatchesPage";
import SessionsPage from "./pages/SessionsPage";
import PostsPage from "./pages/PostsPage";
import CreditsPage from "./pages/CreditsPage";
import RatingPage from "./pages/RatingPage";
import Navbar from "./components/Navbar";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useAuth();

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/skills" element={<SkillCatalogPage />} />
        <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />
        <Route path="/ratings" element={<ProtectedRoute><RatingPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  );
}
