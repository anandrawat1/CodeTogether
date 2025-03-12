import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Sidebar from './Sidebar';
import Client from './Client';
import Editor from './Editor';
import Chat from './Chat';
import Whiteboard from './Whiteboard';
import Run from './Run';
import Preview from './Preview';
import { initSocket } from '../Socket';
import ACTIONS from '../Actions';

const EditorPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract username from location state
    const username = location.state?.username;
    
    const [clients, setClients] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('clients');
    const [currentCode, setCurrentCode] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('javascript');
    const socketRef = useRef(null);
    const codeRef = useRef("");

    useEffect(() => {
        try {
            socketRef.current = initSocket();

            socketRef.current.on('connect_error', handleError);
            socketRef.current.on('connect_failed', handleError);

            function handleError(err) {
                console.error('Socket connection error:', err);
                toast.error('Socket connection failed.');
                navigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, { roomId, username });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (socketId !== socketRef.current.id) {
                    toast.success(`${username} joined the room.`);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
                setClients(clients);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId);
                });
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current.off(ACTIONS.JOINED);
                    socketRef.current.off(ACTIONS.DISCONNECTED);
                    socketRef.current.off(ACTIONS.SYNC_CODE);
                }
            };
        } catch (err) {
            console.error('Socket initialization error:', err);
            toast.error('Could not connect to the server.');
            navigate('/');
        }
    }, [roomId, username, navigate]);

    // Add effect to handle sidebar content changes
    useEffect(() => {
        if (sidebarContent === 'clients' || sidebarContent === 'chat' || sidebarContent === 'run' || sidebarContent === 'preview') {
            socketRef.current?.emit(ACTIONS.REQUEST_CODE, { roomId });
        }
    }, [sidebarContent, roomId]);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied.');
        } catch {
            toast.error('Could not copy Room ID.');
        }
    };

    const handleCodeChange = (code) => {
        codeRef.current = code;
        setCurrentCode(code);
    };

    const handleLanguageChange = (language) => {
        setCurrentLanguage(language);
    };

    if (!username) return <Navigate to="/" />;

    const renderMainContent = () => {
        const renderEditorWithPanel = (SideComponent) => (
            <PanelGroup direction="horizontal" className="flex-1">
                <Panel
                    defaultSize={30} 
                    minSize={SideComponent.type === Whiteboard || SideComponent.type === Preview ? 40 : 30} 
                    maxSize={SideComponent.type === Whiteboard || SideComponent.type === Preview ? 65 : 50}>
                    {SideComponent}
                </Panel>
                <PanelResizeHandle className="w-1 bg-[#393E46] hover:bg-[#bbb8ff] transition-colors duration-200 cursor-col-resize" />
                <Panel defaultSize={70}>
                    <Editor 
                        socketRef={socketRef} 
                        roomId={roomId} 
                        onCodeChange={handleCodeChange}
                        onLanguageChange={handleLanguageChange}
                    />
                </Panel>
            </PanelGroup>
        );

        switch (sidebarContent) {
            case 'chat':
                return renderEditorWithPanel(
                    <Chat socketRef={socketRef} roomId={roomId} username={username} />
                );
            case 'draw':
                // return (
                //     <>
                //         <Client clients={clients} currentUsername={username} onCopyRoomId={copyRoomId} onLeaveRoom={() => navigate('/')} />
                //         <div className="flex-1">
                //             <Whiteboard />
                //         </div>
                //     </>
                return renderEditorWithPanel(
                    <Whiteboard />
                );
            case 'run':
                return renderEditorWithPanel(
                    <Run code={currentCode} language={currentLanguage} />
                );
            case 'preview':
                return renderEditorWithPanel(
                    <Preview code={currentCode} language={currentLanguage} />
                );
            default:
                return renderEditorWithPanel(
                    <Client clients={clients} currentUsername={username} onCopyRoomId={copyRoomId} onLeaveRoom={() => navigate('/')} />
                );
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar onToggle={setSidebarContent} />
            {renderMainContent()}
        </div>
    );
};

export default EditorPage;
