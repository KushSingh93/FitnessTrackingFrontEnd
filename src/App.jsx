import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Private from "./layout/private";
import Public from "./layout/public";
import Cookies from 'js-cookie';

function App() {
  const isAuthenticated = !!Cookies.get('token');

  return (
    <Router>
      <Routes>
        <Route 
          path="/*" 
          element={isAuthenticated ? <Private /> : <Public />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
