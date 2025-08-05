import React from 'react';
import Avatar from 'react-avatar';
import { IoCopy } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ACTIONS from '../../Actions';

const ClientAvatar = ({ username, isCurrentUser = false }) => {
    
    return (
        <div className={`flex flex-col items-center p-3 ${isCurrentUser ? 'bg-[#393E46]' : 'hover:bg-[#393E46]'} rounded-lg cursor-pointer transition-colors`}>
            <Avatar 
                name={username} 
                size= {45} 
                round="8px" 
            />
            <span className={`text-white mt-2 text-center ${isCurrentUser ? 'font-medium' : ''}`}>
                {username} {isCurrentUser && <span className="text-green-400 text-sm">•</span>}
            </span>
        </div>
    );
};

const Client = ({ clients, currentUsername, roomId, socketRef }) => {
    const navigate = useNavigate();

    const copyRoomId = async () => {
        try {
            const roomLink = `${window.location.origin}/room/${roomId}`;
            await navigator.clipboard.writeText(roomLink);
            toast.success('Room link copied.');
        } catch {
            toast.error('Could not copy Room link.');
        }
    };

    const handleLeaveRoom = () => {
        Swal.fire({
            text: 'Are you sure you want to leave this room?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#bbb8ff',
            confirmButtonText: 'Yes, leave',
            background: '#232329',
            color: '#ffffff',
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'font-medium text-black',
                cancelButton: 'font-medium text-black'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (socketRef.current) {
                    socketRef.current.emit(ACTIONS.LEAVE, { roomId });
                }
                navigate('/');
            }
        });
    };

    // Filter unique users based on username
    const uniqueClients = Array.from(new Map(clients.map(client => [client.username, client])).values());
    
    // Separate current user and other users
    const currentUserData = uniqueClients.find(client => client.username === currentUsername);
    const otherUsers = uniqueClients.filter(client => client.username !== currentUsername);

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
            {/* <div className="p-2 flex-shrink-0">
                <p className=" text-lg text-[#bbb8ff] mb-0">Connected Users</p>
            </div> */}
            
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {otherUsers.map((client) => (
                        <ClientAvatar 
                            key={client.socketId} 
                            username={client.username}
                        />
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-2 flex-shrink-0">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={copyRoomId}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#bbb8ff] text-black rounded hover:bg-[#aaaaff] transition-colors font-medium"
                    >
                        <IoCopy />
                        <span>Copy ID</span>
                    </button>
                    <button 
                        onClick={handleLeaveRoom}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-black rounded hover:bg-red-600 transition-colors font-medium"
                    >
                        <FaSignOutAlt />
                        <span>Leave</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Client; 