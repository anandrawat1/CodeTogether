import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Sidebar from '../components/Sidebar';
import Client from '../components/Client';
import Editor from '../components/Editor';
import MonacoEditor from '../components/MonacoEditor';
import Chat from '../components/Chat';
import Whiteboard from '../components/Whiteboard';
import Run from '../components/Run';
import Preview from '../components/Preview';
import VideoCall from '../components/VideoCall';
import { initSocket } from '../initSocket';
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

            // Listen for new messages at EditorPage level
            socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ username: senderUsername, message }) => {
                if (senderUsername !== username) {
                    toast.success('Got new message!');
                }
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (socketId !== socketRef.current.id) {
                    toast.success(`${username} joined the room!`);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
                setClients(clients);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room!`);
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
                    socketRef.current.off(ACTIONS.RECEIVE_MESSAGE);
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
        if (sidebarContent === 'clients' || sidebarContent === 'chat' || sidebarContent === 'run' || sidebarContent === 'preview' || sidebarContent === 'video') {
            socketRef.current?.emit(ACTIONS.REQUEST_CODE, { roomId });
        }
    }, [sidebarContent, roomId]);

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
                <PanelResizeHandle className="w-1 bg-[#393E46] hover:bg-[#bbb8ff] transition-colors duration-200 cursor-col-resize">
                </PanelResizeHandle>
                <Panel defaultSize={70}>
                    <MonacoEditor 
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
                return renderEditorWithPanel(
                    <Whiteboard roomId={roomId} />
                );
            case 'run':
                return renderEditorWithPanel(
                    <Run code={currentCode} language={currentLanguage} />
                );
            case 'preview':
                return renderEditorWithPanel(
                    <Preview code={currentCode} language={currentLanguage} />
                );
            case 'video':
                return renderEditorWithPanel(
                    <VideoCall roomId={roomId} username={username} />
                );
            default:
                return renderEditorWithPanel(
                    <Client 
                        clients={clients} 
                        currentUsername={username} 
                        roomId={roomId}
                        socketRef={socketRef}
                    />
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
