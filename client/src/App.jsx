import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Room from './pages/RoomPage';
import EditorPage from './pages/EditorPage';
import Auth from './pages/AuthPage';
import Home from './pages/HomePage';
import ScrollToTop from './components/common/ScrollToTop';
import MyRoom from './pages/MyRoomPage';
import './App.css';

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/my-room" element={<MyRoom />} />
      </Routes>
    </>
  );
};

export default App; 