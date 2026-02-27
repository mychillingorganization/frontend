import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePage from './pages/CreatePage'; // added CreatePage
import GeneratorPage from './pages/GeneratorPage';
import './App.css';
import MyTemplates from './pages/MyTemplates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/templates" element={<MyTemplates />} />
      </Routes>
    </Router>
  );
}

export default App;
