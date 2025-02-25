import React from 'react';
import Avatar from 'react-avatar';
import { FaCopy } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';

const ClientAvatar = ({ username, isCurrentUser = false }) => {
    return (
        <div className={`flex flex-col items-center p-3 ${isCurrentUser ? 'bg-gray-700' : 'hover:bg-gray-700'} rounded-lg cursor-pointer transition-colors`}>
            <Avatar 
                name={username} 
                size={isCurrentUser ? 48 : 40} 
                round="8px" 
            />
            <span className={`text-white mt-2 text-center ${isCurrentUser ? 'font-medium' : ''}`}>
                {username} {isCurrentUser && <span className="text-green-400 text-sm">•</span>}
            </span>
        </div>
    );
};

const Client = ({ clients, currentUsername, onCopyRoomId, onLeaveRoom }) => {
    // Filter unique users based on username
    const uniqueClients = Array.from(new Map(clients.map(client => [client.username, client])).values());
    
    // Separate current user and other users
    const currentUserData = uniqueClients.find(client => client.username === currentUsername);
    const otherUsers = uniqueClients.filter(client => client.username !== currentUsername);

    return (
        <div className="h-full flex flex-col bg-gray-800 text-white w-96 overflow-hidden">
            <div className="p-4 flex-shrink-0">
                <h2 className="text-xl font-semibold text-center">Connected Users</h2>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                {/* Current User Section */}
                {currentUserData && (
                    <div className="mb-4">
                        <ClientAvatar 
                            username={currentUserData.username} 
                            isCurrentUser={true}
                        />
                    </div>
                )}

                {/* Other Users Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {otherUsers.map((client) => (
                        <ClientAvatar 
                            key={client.socketId} 
                            username={client.username}
                        />
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex-shrink-0">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onCopyRoomId}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                    >
                        <FaCopy />
                        <span>Copy ID</span>
                    </button>
                    <button 
                        onClick={onLeaveRoom}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                    >
                        <IoExitOutline />
                        <span>Leave</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Client; 