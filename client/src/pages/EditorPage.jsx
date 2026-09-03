import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useLocation } from 'react-router-dom';
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

    const username =
        location.state?.username || 'Guest';

    const [clients, setClients] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('clients');
    const [activeMobileView, setActiveMobileView] = useState(null);

    const [currentCode, setCurrentCode] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('javascript');

    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' &&
        window.innerWidth <= 768
    );

    const { socketRef, socketReady } = useSocket();


    /* -----------------------------------------
       Detect Mobile
    ----------------------------------------- */

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


    /* -----------------------------------------
       Socket Room Connection
    ----------------------------------------- */

    useEffect(() => {

        if (!socketReady || !socketRef.current) {
            return;
        }

        const socket = socketRef.current;

        socket.emit(ACTIONS.JOIN, {
            roomId,
            username
        });


        const handleJoined = ({
            clients,
            username: joinedUsername,
            socketId
        }) => {

            if (socketId !== socket.id) {

                toast.success(
                    `${joinedUsername} joined the room.`
                );

                socket.emit(ACTIONS.SYNC_CODE, {
                    socketId,
                    roomId
                });
            }

            setClients(clients);
        };


        const handleDisconnected = ({
            socketId,
            username: leftUsername
        }) => {

            toast.success(
                `${leftUsername} left the room.`
            );

            setClients((prev) =>
                prev.filter(
                    (client) =>
                        client.socketId !== socketId
                )
            );
        };


        const handleMessage = ({
            username: sender
        }) => {

            if (sender !== username) {
                toast.success(
                    'New message received!'
                );
            }
        };


        socket.on(
            ACTIONS.JOINED,
            handleJoined
        );

        socket.on(
            ACTIONS.DISCONNECTED,
            handleDisconnected
        );

        socket.on(
            ACTIONS.RECEIVE_MESSAGE,
            handleMessage
        );


        return () => {

            socket.off(
                ACTIONS.JOINED,
                handleJoined
            );

            socket.off(
                ACTIONS.DISCONNECTED,
                handleDisconnected
            );

            socket.off(
                ACTIONS.RECEIVE_MESSAGE,
                handleMessage
            );

            /*
             * IMPORTANT:
             * Do NOT disconnect socket here.
             * Video call and other room features
             * should stay connected while changing sections.
             */
        };

    }, [
        roomId,
        username,
        socketReady,
        socketRef
    ]);


    /* -----------------------------------------
       Request Latest Code
    ----------------------------------------- */

    useEffect(() => {

        if (
            sidebarContent === 'clients' ||
            sidebarContent === 'chat' ||
            sidebarContent === 'run' ||
            sidebarContent === 'preview' ||
            sidebarContent === 'video'
        ) {

            socketRef.current?.emit(
                ACTIONS.REQUEST_CODE,
                { roomId }
            );
        }

    }, [
        sidebarContent,
        roomId,
        socketRef
    ]);


    /* -----------------------------------------
       Code / Language
    ----------------------------------------- */

    const handleCodeChange = (code) => {
        setCurrentCode(code);
    };


    const handleLanguageChange = (language) => {
        setCurrentLanguage(language);
    };


    /* -----------------------------------------
       Agora Participant UID Mapping
    ----------------------------------------- */

    const participants = useMemo(() => {

        const map = {};


        const createUniqueUid = (socketId) => {

            if (!socketId) {
                return null;
            }

            let hash = 0;

            for (
                let i = 0;
                i < socketId.length;
                i++
            ) {

                hash =
                    ((hash << 5) - hash) +
                    socketId.charCodeAt(i);

                hash |= 0;
            }

            hash = Math.abs(hash);

            return (
                (hash % 2147483646) + 1
            );
        };


        for (const client of clients) {

            const name =
                client.username ||
                client.name ||
                '';

            if (
                !name ||
                !client.socketId
            ) {
                continue;
            }

            const uid =
                createUniqueUid(
                    client.socketId
                );

            if (uid) {
                map[uid] = name;
            }
        }


        if (
            username &&
            socketRef.current?.id
        ) {

            const selfUid =
                createUniqueUid(
                    socketRef.current.id
                );

            if (selfUid) {
                map[selfUid] = username;
            }
        }


        return map;

    }, [
        clients,
        username,
        socketRef
    ]);


    /* -----------------------------------------
       Normal Sidebar Content
    ----------------------------------------- */

    const renderSidebarComponent = (tab) => {

        switch (tab) {

            case 'chat':

                return (
                    <Chat
                        socketRef={socketRef}
                        roomId={roomId}
                        username={username}
                    />
                );


            case 'draw':

                return (
                    <Whiteboard
                        roomId={roomId}
                    />
                );


            case 'run':

                return (
                    <Run
                        code={currentCode}
                        language={currentLanguage}
                    />
                );


            case 'preview':

                return (
                    <Preview
                        code={currentCode}
                        language={currentLanguage}
                    />
                );


            case 'clients':

            default:

                return (
                    <Client
                        clients={clients}
                        currentUsername={username}
                        roomId={roomId}
                        socketRef={socketRef}
                    />
                );
        }
    };


    /* -----------------------------------------
       Mobile Content
       VideoCall stays mounted even when
       changing sections.
    ----------------------------------------- */

    const renderMobileContent = () => {

        return (

            <div className="flex-1 md:hidden relative">

                {/* 
                    VideoCall is ALWAYS mounted.
                    We only hide/show it visually.
                */}

                <div
                    className={
                        activeMobileView === 'video'
                            ? 'block h-full'
                            : 'hidden'
                    }
                >

                    <VideoCall
                        roomId={roomId}
                        username={username}
                        participants={participants}
                    />

                </div>


                {activeMobileView &&
                    activeMobileView !== 'video' && (

                        <div className="h-full">

                            {renderSidebarComponent(
                                activeMobileView
                            )}

                        </div>

                    )
                }


                {!activeMobileView && (

                    <MonacoEditor
                        roomId={roomId}
                        onCodeChange={handleCodeChange}
                        onLanguageChange={
                            handleLanguageChange
                        }
                    />

                )}

            </div>
        );
    };


    /* -----------------------------------------
       Desktop Content
       VideoCall remains mounted.
    ----------------------------------------- */

    const renderDesktopContent = () => {

        const isWhiteboardOrPreview =
            sidebarContent === 'draw' ||
            sidebarContent === 'preview';


        return (

            <div className="hidden md:flex flex-1">

                <PanelGroup
                    direction="horizontal"
                    className="flex-1"
                >

                    {/* LEFT SIDEBAR PANEL */}

                    <Panel
                        defaultSize={30}
                        minSize={
                            isWhiteboardOrPreview
                                ? 40
                                : 30
                        }
                        maxSize={
                            isWhiteboardOrPreview
                                ? 65
                                : 50
                        }
                    >

                        <div className="h-full relative">

                            {/* 
                                IMPORTANT:
                                VideoCall is ALWAYS mounted.
                                Changing Chat / Run / Users /
                                Whiteboard will NOT unmount it.
                            */}

                            <div
                                className={
                                    sidebarContent === 'video'
                                        ? 'block h-full'
                                        : 'hidden'
                                }
                            >

                                <VideoCall
                                    roomId={roomId}
                                    username={username}
                                    participants={participants}
                                />

                            </div>


                            {/* Other Sidebar Sections */}

                            {sidebarContent !== 'video' && (

                                <div className="h-full">

                                    {renderSidebarComponent(
                                        sidebarContent
                                    )}

                                </div>

                            )}

                        </div>

                    </Panel>


                    <PanelResizeHandle
                        className="
                            w-1
                            bg-[#393E46]
                            hover:bg-[#bbb8ff]
                            transition-colors
                            duration-200
                            cursor-col-resize
                        "
                    />


                    {/* CODE EDITOR */}

                    <Panel defaultSize={70}>

                        <MonacoEditor
                            roomId={roomId}
                            onCodeChange={
                                handleCodeChange
                            }
                            onLanguageChange={
                                handleLanguageChange
                            }
                        />

                    </Panel>

                </PanelGroup>

            </div>
        );
    };


    /* -----------------------------------------
       MAIN UI
    ----------------------------------------- */

    return (

        <div className="flex h-screen pb-14 md:pb-0 overflow-hidden">

            <Sidebar
                setActiveMobileView={
                    setActiveMobileView
                }
                setSidebarContent={
                    setSidebarContent
                }
            />

            {isMobile
                ? renderMobileContent()
                : renderDesktopContent()
            }

        </div>
    );
};


export default EditorPage;