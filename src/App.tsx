import React, { useEffect, useState } from "react";
import mqtt from "precompiled-mqtt";
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./screens/LoginPage";
import HomePage from "./screens/HomePage";

function App() {
  
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />      
      <Route path="/home" element={<HomePage />} />      
    </Routes>
  </Router>
  );
}

export default App;
