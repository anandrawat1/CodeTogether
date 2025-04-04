import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const joinRoom = async () => {
        if (!roomId || !username) {
            toast.error('Room ID & Username required');
            return;
        }

        try {
            setIsLoading(true);
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId, username })
            })
            
            const data = await response.json();
            setIsLoading(false);
            
            if (!data.success) {
                toast.error(data.message || 'Failed to join room');
                return;
            }

            toast.success('Joined Room Successfully!');
            navigate(`/editor/${roomId}`, {
                state: {
                    username,
                },
            });
        } catch (error) {
            console.error('Error joining room:', error);
            setIsLoading(false);
        }
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#bbb8ff] text-center mb-8">
                Join Room
            </h1>
            <div className="space-y-4">
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#232329] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="Room ID"
                    onChange={(e) => setRoomId(e.target.value)}
                    value={roomId}
                    onKeyUp={handleInputEnter}
                />
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#232329] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    onKeyUp={handleInputEnter}
                />
                <button 
                    className={`w-full bg-[#bbb8ff] text-black py-2 px-4 rounded-md hover:bg-[#aaaaff] transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={joinRoom}
                >
                    {isLoading ? 'Joining...' : 'Join Room'}
                </button>
            </div>
        </div>
    );
};

export default JoinRoom; 