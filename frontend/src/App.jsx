import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import GiveTakePage from "./pages/GiveTakePage";
import CreatePostPage from "./pages/CreatePostPage";
import UserProfilePage from "./pages/UserProfilePage";
import EnrollmentPage from "./pages/EnrollmentPage";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/give-take"
        element={
          <ProtectedRoute>
            <Navbar />
            <GiveTakePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/give-take/create"
        element={
          <ProtectedRoute>
            <Navbar />
            <CreatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <Navbar />
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/enrollment"
        element={
          <ProtectedRoute>
            <Navbar />
            <EnrollmentPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
