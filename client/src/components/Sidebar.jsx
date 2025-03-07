import React, { useState } from 'react';
import { FaComments, FaUsers, FaPencilAlt, FaPlay } from 'react-icons/fa';

const Sidebar = ({ onToggle }) => {
  const [activeTab, setActiveTab] = useState('clients');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onToggle(tab);
  };

  return (
    
    <div className="h-screen w-16 bg-gray-800 text-white flex flex-col items-center py-4 border-r border-gray-700">
      <div className="flex flex-col space-y-8">
      <button
          onClick={() => handleTabChange('clients')}
          className={`p-3 rounded-lg transition-all ${
            activeTab === 'clients'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          <FaUsers size={23} />
        </button>
        <button
          onClick={() => handleTabChange('chat')}
          className={`p-3 rounded-lg transition-all ${
            activeTab === 'chat'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          <FaComments size={23} />
        </button>
        <button
          onClick={() => handleTabChange('draw')}
          className={`p-3 rounded-lg transition-all ${
            activeTab === 'draw'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          <FaPencilAlt size={23} />
        </button>
        <button
          onClick={() => handleTabChange('run')}
          className={`p-3 rounded-lg transition-all ${
            activeTab === 'run'
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          <FaPlay size={23} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 