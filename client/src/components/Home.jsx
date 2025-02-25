import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room ID & username required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="min-h-screen bg-[#1c1e29] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Code Together
                </h1>
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <p className="text-center text-gray-400">
                        If you don't have an invite then create{' '}
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            new room
                        </a>
                    </p>
                </div>
            </div>

            
            <footer className="mt-3 text-gray-700 text-sm">
                <p className="text-center">
                    Built for collaborative coding. <br /> © {new Date().getFullYear()} | &nbsp;
                    <a 
                        href="https://github.com/shomik-das" 
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                    shomik das
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home; 