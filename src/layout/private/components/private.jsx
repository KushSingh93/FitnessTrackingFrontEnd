import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load the components
const UserDashboard = lazy(() => import("../../../screens/dashboard"));
const AnalysisPage = lazy(() => import("../../../screens/analysis"));
const ProfilePage = lazy(() => import("../../../screens/profile"));

const Private = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
};

export default Private;
