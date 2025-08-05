import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { IoMdChatbubbles } from "react-icons/io";
import { MdDraw, MdRemoveRedEye } from "react-icons/md";
import { FaPlay, FaVideo } from "react-icons/fa";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Sidebar = ({ setSidebarContent, setActiveMobileView }) => {
  const [activeTab, setActiveTab] = useState('clients');

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setActiveTab(null);
    }
  }, []);

  const handleTabChange = (tab) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const newTab = activeTab === tab ? null : tab;
      setActiveTab(newTab);
      setActiveMobileView(newTab);
    } else {
      setActiveTab(tab);
      setSidebarContent(tab);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-16 bg-[#1e1e1e] text-white flex-col items-center justify-center py-4 border-r border-gray-700 shadow-lg">
        <div className="flex flex-col space-y-8">
          <Tippy content="Connected Users" placement="right">
            <button
              onClick={() => handleTabChange('clients')}
              className={`p-3 rounded-lg transition-all ${
                activeTab === 'clients' ? 'bg-[#393E46] text-white' : 'text-gray-400'
              }`}
            >
              <FaUsers size={24} />
            </button>
          </Tippy>

          <Tippy content="Group Chat" placement="right">
            <button
              onClick={() => handleTabChange('chat')}
              className={`p-3 rounded-lg transition-all ${
                activeTab === 'chat' ? 'bg-[#393E46] text-white' : 'text-gray-400'
              }`}
            >
              <IoMdChatbubbles size={24} />
            </button>
          </Tippy>

          <Tippy content="Draw" placement="right">
            <button
              onClick={() => handleTabChange('draw')}
              className={`p-3 rounded-lg transition-all ${
                activeTab === 'draw' ? 'bg-[#393E46] text-white' : 'text-gray-400'
              }`}
            >
              <MdDraw size={24} />
            </button>
          </Tippy>

          <Tippy content="Run Code" placement="right">
            <button
              onClick={() => handleTabChange('run')}
              className={`p-3 rounded-lg transition-all ${
                activeTab === 'run' ? 'bg-[#393E46] text-white' : 'text-gray-400'
              }`}
            >
              <FaPlay size={24} />
            </button>
          </Tippy>

          <Tippy content="Preview" placement="right">
            <button
              onClick={() => handleTabChange('preview')}
              className={`p-3 rounded-lg transition-all ${
                activeTab === 'preview' ? 'bg-[#393E46] text-white' : 'text-gray-400'
              }`}
            >
              <MdRemoveRedEye size={24} />
            </button>
          </Tippy>

          <Tippy content="Video Call" placement="right">
            <button
              onClick={() => handleTabChange('video')}
              className={`p-3 rounded-lg transition-all ${
                activeTab === 'video' ? 'bg-[#393E46] text-white' : 'text-gray-400'
              }`}
            >
              <FaVideo size={24} />
            </button>
          </Tippy>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e1e1e] text-white flex justify-around items-center py-3 md:hidden border-t border-gray-700 shadow-lg">
        <button onClick={() => handleTabChange('clients')} className={`${activeTab === 'clients' ? 'text-white' : 'text-gray-400'}`}>
          <FaUsers size={24} />
        </button>
        <button onClick={() => handleTabChange('chat')} className={`${activeTab === 'chat' ? 'text-white' : 'text-gray-400'}`}>
          <IoMdChatbubbles size={24} />
        </button>
        <button onClick={() => handleTabChange('draw')} className={`${activeTab === 'draw' ? 'text-white' : 'text-gray-400'}`}>
          <MdDraw size={24} />
        </button>
        <button onClick={() => handleTabChange('run')} className={`${activeTab === 'run' ? 'text-white' : 'text-gray-400'}`}>
          <FaPlay size={24} />
        </button>
        <button onClick={() => handleTabChange('preview')} className={`${activeTab === 'preview' ? 'text-white' : 'text-gray-400'}`}>
          <MdRemoveRedEye size={24} />
        </button>
        <button onClick={() => handleTabChange('video')} className={`${activeTab === 'video' ? 'text-white' : 'text-gray-400'}`}>
          <FaVideo size={24} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
