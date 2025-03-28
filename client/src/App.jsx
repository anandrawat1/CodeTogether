import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditorPage from './components/EditorPage';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
    </Routes>
  );
};

export default App; 