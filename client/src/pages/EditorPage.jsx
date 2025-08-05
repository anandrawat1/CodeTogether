import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import Sidebar from '../components/features/Sidebar';
import Client from '../components/features/Client';
import MonacoEditor from '../components/features/MonacoEditor';
import Chat from '../components/features/Chat';
import Whiteboard from '../components/features/Whiteboard';
import Run from '../components/features/Run';
import Preview from '../components/features/Preview';
import VideoCall from '../components/features/VideoCall';

import { initSocket } from '../initSocket';
import ACTIONS from '../Actions';


const EditorPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username;

    const [clients, setClients] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('clients');
    const [activeMobileView, setActiveMobileView] = useState(null);
    const [currentCode, setCurrentCode] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('javascript');
    const socketRef = useRef(null);
    const codeRef = useRef('');

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    useEffect(() => {
        const socket = initSocket();
        socketRef.current = socket;

        socket.on('connect_error', handleError);
        socket.on('connect_failed', handleError);

        function handleError(err) {
            console.error('Socket error:', err);
            toast.error('Socket connection failed.');
            navigate('/');
        }

        socket.emit(ACTIONS.JOIN, { roomId, username });

        socket.on(ACTIONS.JOINED, ({ clients, username: joinedUsername, socketId }) => {
            if (socketId !== socket.id) {
                toast.success(`${joinedUsername} joined the room.`);
                socket.emit(ACTIONS.SYNC_CODE, {
                code: codeRef.current,
                socketId,
                });
            }
            setClients(clients);
        });

        socket.on(ACTIONS.DISCONNECTED, ({ socketId, username: leftUsername }) => {
            toast.success(`${leftUsername} left the room.`);
            setClients((prev) => prev.filter((client) => client.socketId !== socketId));
        });

        socket.on(ACTIONS.RECEIVE_MESSAGE, ({ username: sender }) => {
            if (sender !== username) toast.success('New message received!');
        });

        return () => {
            socket.disconnect();
            socket.off();
        };
    }, [roomId, username, navigate]);


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

    const handleSidebarToggle = (tab) => {
        if (isMobile) {
            setActiveMobileView((prev) => (prev === tab ? null : tab));
        }
        else {
            setSidebarContent(tab);
        }
    };

    const renderSidebarComponent = (tab) => {
        switch (tab) {
            case 'chat':
                return <Chat socketRef={socketRef} roomId={roomId} username={username} />;
            case 'draw':
                return <Whiteboard roomId={roomId} />;
            case 'run':
                return <Run code={currentCode} language={currentLanguage} />;
            case 'preview':
                return <Preview code={currentCode} language={currentLanguage} />;
            case 'video':
                return <VideoCall roomId={roomId} username={username} />;
            default:
                return <Client clients={clients} currentUsername={username} roomId={roomId} socketRef={socketRef} />;
        }
    };

    const renderMobileContent = () => (
        <div className="flex-1 md:hidden">
            {activeMobileView ? (renderSidebarComponent(activeMobileView)) : (
                <MonacoEditor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={handleCodeChange}
                    onLanguageChange={handleLanguageChange}
                />
            )}
        </div>
    );

    const renderDesktopContent = () => {
        const isWhiteboardOrPreview = sidebarContent === 'draw' || sidebarContent === 'preview';

        return (
            <div className="hidden md:flex flex-1">
                <PanelGroup direction="horizontal" className="flex-1">
                    <Panel defaultSize={30} minSize={isWhiteboardOrPreview ? 40 : 30} maxSize={isWhiteboardOrPreview ? 65 : 50}>
                        {renderSidebarComponent(sidebarContent)}
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-[#393E46] hover:bg-[#bbb8ff] transition-colors duration-200 cursor-col-resize" />
                    <Panel defaultSize={70}>
                        <MonacoEditor
                            socketRef={socketRef}
                            roomId={roomId}
                            onCodeChange={handleCodeChange}
                            onLanguageChange={handleLanguageChange}
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    };

    return (
        <div className="flex h-screen pb-14 md:pb-0 overflow-hidden">
            <Sidebar setActiveMobileView={setActiveMobileView} setSidebarContent={setSidebarContent}/>
            {isMobile ? renderMobileContent() : renderDesktopContent()}
        </div>
    );
};

export default EditorPage;
