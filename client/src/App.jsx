import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Room from './pages/Room';
import EditorPage from './pages/EditorPage';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Room />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
    </Routes>
  );
};

export default App; 