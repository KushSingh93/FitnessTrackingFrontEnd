import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/Dashboard";
import AnalysisPage from "../screens/analysis";
import Login from "../screens/auth/login";
import Signup from "../screens/auth/signup";
import ProfilePage from "../screens/profile";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
