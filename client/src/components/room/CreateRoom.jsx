import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createNewRoom = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const id = uuidV4();
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: id, roomName, username }),
                credentials: 'include'
            });
            const data = await response.json();
            setIsLoading(false);
            if (!data.success) {
                toast.error(data.message || 'Failed to create room');
                return;
            }
            
            toast.success('Room Created Successfully!');
            
            // Navigate to the room immediately
            navigate(`/editor/${id}`, {
                state: {
                    username,
                },
            });
        } catch (error) {
            console.error('Error creating room:', error);
            setIsLoading(false);
            toast.error('Failed to create room');
        }
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter' && username && roomName) {
            createNewRoom(e);
        }
    };

    return (
        <div>
            {/* <h1 className="text-3xl font-bold text-[#bbb8ff] text-center mb-8">
                Create New Room
            </h1> */}
            <div className="space-y-4">
                <input 
                    type="text"
                    placeholder="Room Name"
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName}
                    className="w-full px-4 py-2 bg-[#2A2A30] text-white rounded-md focus:outline-none placeholder-gray-400"
                    onKeyUp={handleInputEnter}
                />
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#2A2A30] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    onKeyUp={handleInputEnter}
                />
                <button 
                    className={`w-full bg-[#bbb8ff] text-black py-2 px-4 rounded-md hover:bg-[#aaaaff] transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={createNewRoom}
                >
                    {isLoading ? 'Creating...' : 'Create Room'}
                </button>
            </div>
        </div>
    );
};

export default CreateRoom; 