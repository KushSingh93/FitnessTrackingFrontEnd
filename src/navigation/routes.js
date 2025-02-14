import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/UserDashboard";
import AnalysisPage from "../screens/AnalysisPage"; 
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute"; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/analysis" element={<AnalysisPage />} /> 
        </Route>

      </Routes>
    </Router>
  );
};

export default AppRoutes;
