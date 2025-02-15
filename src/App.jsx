import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./screens/auth/login";  
import SignupPage from "./screens/auth/signup";  
import UserDashboard from "./pages/UserDashboard";  
import AnalysisPage from "./screens/analysis";  
import ProfilePage from "./screens/profile";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
