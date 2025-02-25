import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
import Sidebar from './Sidebar';
import Chat from './Chat';

const ACTIONS = {
    JOIN: "join",
    JOINED: "joined",
    DISCONNECTED: "disconnected",
    CODE_CHANGE: "code-change",
    SYNC_CODE: "sync-code",
    LEAVE: "leave",
};

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('clients');
    const currentUsername = location.state?.username;

    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();
                
                socketRef.current.on('connect_error', handleErrors);
                socketRef.current.on('connect_failed', handleErrors);

                function handleErrors(e) {
                    console.log('socket error', e);
                    toast.error('Socket connection failed, try again later.');
                    reactNavigator('/');
                }

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: currentUsername,
                });

                // Listening for joined event
                socketRef.current.on(
                    ACTIONS.JOINED,
                    ({ clients, username, socketId }) => {
                        if (username !== currentUsername) {
                            toast.success(`${username} joined the room.`);
                        }
                        // Update clients list with unique users
                        setClients(clients);
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                );

                // Listening for disconnected
                socketRef.current.on(
                    ACTIONS.DISCONNECTED,
                    ({ socketId, username }) => {
                        toast.success(`${username} left the room.`);
                        setClients((prev) => {
                            return prev.filter(
                                (client) => client.socketId !== socketId
                            );
                        });
                    }
                );
            } catch (err) {
                console.error('Socket initialization error:', err);
                toast.error('Failed to connect to the server');
                reactNavigator('/');
            }
        };
        
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off('connect_error');
                socketRef.current.off('connect_failed');
                socketRef.current.disconnect();
            }
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen">
            <Sidebar onToggle={setSidebarContent} />
            {sidebarContent === 'chat' ? (
                <Chat />
            ) : (
                <Client 
                    clients={clients}
                    currentUsername={currentUsername}
                    onCopyRoomId={copyRoomId}
                    onLeaveRoom={leaveRoom}
                />
            )}
            <div className="flex-1">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage; 