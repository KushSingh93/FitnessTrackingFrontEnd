import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AnalysisPage from "./screens/analysis/AnalysisPage"; // ✅ Import Analysis Page

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to Login Page */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/analysis" element={<AnalysisPage />} />  {/* ✅ Add Analysis Route */}

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
