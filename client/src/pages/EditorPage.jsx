import React, { useState, useEffect, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import Sidebar from '../components/features/Sidebar';
import Client from '../components/features/Client';
import MonacoEditor from '../components/features/MonacoEditor';
import Chat from '../components/features/Chat';
import Whiteboard from '../components/features/Whiteboard';
import Run from '../components/features/Run';
import Preview from '../components/features/Preview';
import VideoCall from '../components/features/VideoCall';

import ACTIONS from '../Actions';
import { useSocket } from '../context/SocketContext';


const EditorPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || 'Guest';

    const [clients, setClients] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('clients');
    const [activeMobileView, setActiveMobileView] = useState(null);
    const [currentCode, setCurrentCode] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('javascript');
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
    const { socketRef, socketReady } = useSocket();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    

    useEffect(() => {
        if (!socketReady || !socketRef.current) return;
        const socket = socketRef.current;

        socket.emit(ACTIONS.JOIN, { roomId, username });

        socket.on(ACTIONS.JOINED, ({ clients, username: joinedUsername, socketId }) => {
            if (socketId !== socket.id) {
                toast.success(`${joinedUsername} joined the room.`);
                socket.emit(ACTIONS.SYNC_CODE, {
                socketId,
                roomId,
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
    }, [roomId, username, navigate, socketReady, socketRef]);


    useEffect(() => {
        if (sidebarContent === 'clients' || sidebarContent === 'chat' || sidebarContent === 'run' || sidebarContent === 'preview' || sidebarContent === 'video') {
            socketRef.current?.emit(ACTIONS.REQUEST_CODE, { roomId });
        }
    }, [sidebarContent, roomId]);

    const handleCodeChange = (code) => {
        setCurrentCode(code);
    };

    const handleLanguageChange = (language) => {
        setCurrentLanguage(language);
    };

//do not understand this code
    const participants = useMemo(() => {
        const map = {};
        for (const c of clients) {
            const name = c.username || c.name || '';
            if (!name) continue;
            const uid = Math.abs(Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0));
            map[uid] = name;
        }
        // include current user too
        if (username) {
            const selfUid = Math.abs(Array.from(username).reduce((acc, ch) => acc + ch.charCodeAt(0), 0));
            map[selfUid] = username;
        }
        return map;
    }, [clients, username]);

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
                return <VideoCall roomId={roomId} username={username} participants={participants} />;
            default:
                return <Client clients={clients} currentUsername={username} roomId={roomId} socketRef={socketRef} />;
        }
    };

    const renderMobileContent = () => (
        <div className="flex-1 md:hidden">
            {activeMobileView ? (renderSidebarComponent(activeMobileView)) : (
                <MonacoEditor
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
                            roomId={roomId}
                            onCodeChange={handleCodeChange}
                            onLanguageChange={handleLanguageChange}
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    };
    // if(!socketReady){
    //     toast.loading("Connecting to the room... ", {duration: 1000});
    // }
    return (
        <div className="flex h-screen pb-14 md:pb-0 overflow-hidden">
            <Sidebar setActiveMobileView={setActiveMobileView} setSidebarContent={setSidebarContent}/>
            {isMobile ? renderMobileContent() : renderDesktopContent()}
        </div>
    );
};

export default EditorPage;
