import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import Analysis from "./screens/analysis";  // ✅ Updated import to use the refactored structure
import ProfileManagementPage from "./screens/profile/ProfileManagementPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/analysis" element={<Analysis />} />  {/* ✅ Updated Route */}
        <Route path="/profile" element={<ProfileManagementPage />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
