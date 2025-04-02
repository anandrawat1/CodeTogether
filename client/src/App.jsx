import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Room from './components/Room';
import EditorPage from './components/EditorPage';
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