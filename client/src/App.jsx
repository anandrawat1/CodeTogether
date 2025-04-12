import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Room from './pages/Room';
import EditorPage from './pages/EditorPage';
import Auth from './pages/Auth';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Room />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default App; 