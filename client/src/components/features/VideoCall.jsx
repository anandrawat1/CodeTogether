import React, { useEffect, useMemo, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMicrophone,
    faMicrophoneSlash,
    faVideo,
    faVideoSlash,
    faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useSocket } from '../../context/SocketContext';

const APP_ID = import.meta.env.VITE_VIDEO_CALL_APP_ID;

const createUniqueUid = (socketId) => {
    if (!socketId) {
        return Math.floor(Math.random() * 2147483646) + 1;
    }

    let hash = 0;

    for (let i = 0; i < socketId.length; i++) {
        hash = ((hash << 5) - hash) + socketId.charCodeAt(i);
        hash |= 0;
    }

    hash = Math.abs(hash);

    return (hash % 2147483646) + 1;
};

const VideoCall = ({ roomId, username, participants = {} }) => {
    const { socketRef, socketReady } = useSocket();

    const [isJoined, setIsJoined] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);

    const [remoteUsers, setRemoteUsers] = useState([]);

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const [localUid, setLocalUid] = useState(null);

    const [remoteMediaState, setRemoteMediaState] = useState(new Map());

    const client = useMemo(() => {
        return AgoraRTC.createClient({
            mode: 'rtc',
            codec: 'vp8'
        });
    }, []);

    const localUidRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const localVideoTrackRef = useRef(null);
    const joinedRef = useRef(false);

    const socketId = socketRef.current?.id;

    /*
     * Subscribe to remote users.
     */
    useEffect(() => {
        if (!client) return;

        const handleUserPublished = async (user, mediaType) => {
            try {
                await client.subscribe(user, mediaType);

                if (mediaType === 'video' && user.videoTrack) {
                    setRemoteUsers((prev) => {
                        const exists = prev.some(
                            (item) => item.uid === user.uid
                        );

                        if (exists) {
                            return prev.map((item) =>
                                item.uid === user.uid
                                    ? {
                                        ...item,
                                        videoTrack: user.videoTrack
                                    }
                                    : item
                            );
                        }

                        return [...prev, user];
                    });

                    setRemoteMediaState((prev) => {
                        const next = new Map(prev);

                        const oldState = next.get(user.uid) || {
                            hasVideo: false,
                            hasAudio: false
                        };

                        next.set(user.uid, {
                            ...oldState,
                            hasVideo: true
                        });

                        return next;
                    });

                    setTimeout(() => {
                        const element = document.getElementById(
                            `remote-player-${user.uid}`
                        );

                        if (element && user.videoTrack) {
                            user.videoTrack.play(element);
                        }
                    }, 100);
                }

                if (mediaType === 'audio' && user.audioTrack) {
                    user.audioTrack.play();

                    setRemoteUsers((prev) => {
                        const exists = prev.some(
                            (item) => item.uid === user.uid
                        );

                        if (exists) {
                            return prev;
                        }

                        return [...prev, user];
                    });

                    setRemoteMediaState((prev) => {
                        const next = new Map(prev);

                        const oldState = next.get(user.uid) || {
                            hasVideo: false,
                            hasAudio: false
                        };

                        next.set(user.uid, {
                            ...oldState,
                            hasAudio: true
                        });

                        return next;
                    });
                }
            } catch (error) {
                console.error(
                    'Failed to subscribe to remote user:',
                    error
                );
            }
        };

        const handleUserUnpublished = (user, mediaType) => {
            if (mediaType === 'video') {
                setRemoteMediaState((prev) => {
                    const next = new Map(prev);

                    const oldState = next.get(user.uid) || {
                        hasVideo: false,
                        hasAudio: false
                    };

                    next.set(user.uid, {
                        ...oldState,
                        hasVideo: false
                    });

                    return next;
                });

                setRemoteUsers((prev) =>
                    prev.map((item) =>
                        item.uid === user.uid
                            ? {
                                ...item,
                                videoTrack: null
                            }
                            : item
                    )
                );
            }

            if (mediaType === 'audio') {
                setRemoteMediaState((prev) => {
                    const next = new Map(prev);

                    const oldState = next.get(user.uid) || {
                        hasVideo: false,
                        hasAudio: false
                    };

                    next.set(user.uid, {
                        ...oldState,
                        hasAudio: false
                    });

                    return next;
                });
            }
        };

        const handleUserLeft = (user) => {
            setRemoteUsers((prev) =>
                prev.filter((item) => item.uid !== user.uid)
            );

            setRemoteMediaState((prev) => {
                const next = new Map(prev);
                next.delete(user.uid);
                return next;
            });
        };

        client.on(
            'user-published',
            handleUserPublished
        );

        client.on(
            'user-unpublished',
            handleUserUnpublished
        );

        client.on(
            'user-left',
            handleUserLeft
        );

        return () => {
            client.off(
                'user-published',
                handleUserPublished
            );

            client.off(
                'user-unpublished',
                handleUserUnpublished
            );

            client.off(
                'user-left',
                handleUserLeft
            );
        };
    }, [client]);

    /*
     * Join video call manually.
     */
    const joinVideoCall = async () => {
        if (isJoined || isJoining) {
            return;
        }

        if (!socketReady || !socketRef.current || !socketId) {
            alert('Connecting to server. Please try again in a moment.');
            return;
        }

        if (!roomId) {
            alert('Room ID is missing.');
            return;
        }

        if (!APP_ID) {
            alert('Agora App ID is missing.');
            return;
        }

        setIsJoining(true);

        let audioTrack = null;
        let videoTrack = null;

        try {
            const uid = createUniqueUid(socketId);

            localUidRef.current = uid;
            setLocalUid(uid);

            const backendUrl =
                import.meta.env.VITE_BACKEND_URL ||
                'http://localhost:5000';

            const tokenResponse = await fetch(
                `${backendUrl}/api/agora/token?channelName=${encodeURIComponent(
                    roomId
                )}&uid=${uid}`
            );

            if (!tokenResponse.ok) {
                throw new Error(
                    `Failed to get Agora token: ${tokenResponse.status}`
                );
            }

            const { token } = await tokenResponse.json();

            await client.join(
                APP_ID,
                roomId,
                token,
                uid
            );

            joinedRef.current = true;

            audioTrack =
                await AgoraRTC.createMicrophoneAudioTrack().catch(
                    (error) => {
                        console.error(
                            'Microphone error:',
                            error
                        );

                        return null;
                    }
                );

            videoTrack =
                await AgoraRTC.createCameraVideoTrack().catch(
                    (error) => {
                        console.error(
                            'Camera error:',
                            error
                        );

                        return null;
                    }
                );

            localAudioTrackRef.current = audioTrack;
            localVideoTrackRef.current = videoTrack;

            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            const tracks = [
                audioTrack,
                videoTrack
            ].filter(Boolean);

            if (tracks.length > 0) {
                await client.publish(tracks);
            }

            setIsJoined(true);

            setTimeout(() => {
                const element = document.getElementById(
                    `local-player-${uid}`
                );

                if (element && videoTrack) {
                    videoTrack.play(element);
                }
            }, 100);

        } catch (error) {
            console.error(
                'Error joining video call:',
                error
            );

            if (joinedRef.current) {
                try {
                    await client.leave();
                } catch (_) {}
            }

            joinedRef.current = false;

            audioTrack?.stop();
            audioTrack?.close();

            videoTrack?.stop();
            videoTrack?.close();

            localAudioTrackRef.current = null;
            localVideoTrackRef.current = null;

            setLocalAudioTrack(null);
            setLocalVideoTrack(null);
            setLocalUid(null);
            setIsJoined(false);

            if (
                error?.message?.includes('PERMISSION_DENIED')
            ) {
                alert(
                    'Please allow camera and microphone permissions to join the video call.'
                );
            } else {
                alert(
                    error?.message ||
                    'Unable to join video call.'
                );
            }
        } finally {
            setIsJoining(false);
        }
    };

    /*
     * Leave video call.
     */
    const leaveVideoCall = async () => {
        try {
            const tracks = [
                localAudioTrackRef.current,
                localVideoTrackRef.current
            ].filter(Boolean);

            if (tracks.length > 0) {
                try {
                    await client.unpublish(tracks);
                } catch (error) {
                    console.error(
                        'Unpublish failed:',
                        error
                    );
                }
            }

            tracks.forEach((track) => {
                try {
                    track.stop();
                } catch (_) {}

                try {
                    track.close();
                } catch (_) {}
            });

            if (joinedRef.current) {
                await client.leave();
            }
        } catch (error) {
            console.error(
                'Leave video call failed:',
                error
            );
        } finally {
            joinedRef.current = false;

            localAudioTrackRef.current = null;
            localVideoTrackRef.current = null;

            setLocalAudioTrack(null);
            setLocalVideoTrack(null);
            setLocalUid(null);

            setRemoteUsers([]);
            setRemoteMediaState(new Map());

            setIsJoined(false);
            setIsAudioEnabled(true);
            setIsVideoEnabled(true);
        }
    };

    /*
     * Cleanup when component is destroyed.
     */
    useEffect(() => {
        return () => {
            const cleanup = async () => {
                try {
                    const tracks = [
                        localAudioTrackRef.current,
                        localVideoTrackRef.current
                    ].filter(Boolean);

                    if (tracks.length > 0) {
                        try {
                            await client.unpublish(tracks);
                        } catch (_) {}
                    }

                    tracks.forEach((track) => {
                        try {
                            track.stop();
                        } catch (_) {}

                        try {
                            track.close();
                        } catch (_) {}
                    });

                    if (joinedRef.current) {
                        await client.leave();
                    }
                } catch (error) {
                    console.error(
                        'Agora cleanup failed:',
                        error
                    );
                }

                joinedRef.current = false;
            };

            cleanup();
        };
    }, [client]);

    const toggleAudio = async () => {
        if (!localAudioTrackRef.current) {
            return;
        }

        try {
            const nextState = !isAudioEnabled;

            await localAudioTrackRef.current.setEnabled(
                nextState
            );

            setIsAudioEnabled(nextState);
        } catch (error) {
            console.error(
                'Audio toggle failed:',
                error
            );
        }
    };

    const toggleVideo = async () => {
        if (!localVideoTrackRef.current) {
            return;
        }

        try {
            const nextState = !isVideoEnabled;

            await localVideoTrackRef.current.setEnabled(
                nextState
            );

            setIsVideoEnabled(nextState);
        } catch (error) {
            console.error(
                'Video toggle failed:',
                error
            );
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">

            {/* Header */}
            <div className="p-2 flex-shrink-0 flex justify-between items-center">
                <p className="text-lg text-[#bbb8ff] mb-0">
                    Video Call
                </p>

                {isJoined && (
                    <div className="flex gap-2">

                        <button
                            onClick={toggleAudio}
                            className={`p-1.5 rounded-full w-7 h-7 flex items-center justify-center ${
                                isAudioEnabled
                                    ? 'bg-[#bbb8ff] hover:bg-[#a5a2ff]'
                                    : 'bg-red-500 hover:bg-red-600'
                            } transition-colors`}
                            title={
                                isAudioEnabled
                                    ? 'Mute Audio'
                                    : 'Unmute Audio'
                            }
                        >
                            <FontAwesomeIcon
                                icon={
                                    isAudioEnabled
                                        ? faMicrophone
                                        : faMicrophoneSlash
                                }
                                className={`text-xs ${
                                    isAudioEnabled
                                        ? 'text-black'
                                        : 'text-white'
                                }`}
                            />
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`p-1.5 rounded-full w-7 h-7 flex items-center justify-center ${
                                isVideoEnabled
                                    ? 'bg-[#bbb8ff] hover:bg-[#a5a2ff]'
                                    : 'bg-red-500 hover:bg-red-600'
                            } transition-colors`}
                            title={
                                isVideoEnabled
                                    ? 'Turn Off Video'
                                    : 'Turn On Video'
                            }
                        >
                            <FontAwesomeIcon
                                icon={
                                    isVideoEnabled
                                        ? faVideo
                                        : faVideoSlash
                                }
                                className={`text-xs ${
                                    isVideoEnabled
                                        ? 'text-black'
                                        : 'text-white'
                                }`}
                            />
                        </button>

                    </div>
                )}
            </div>

            {/* Not joined */}
            {!isJoined && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">

                    <div className="w-20 h-20 rounded-full bg-[#393E46] flex items-center justify-center mb-4">
                        <FontAwesomeIcon
                            icon={faVideo}
                            className="text-2xl text-[#bbb8ff]"
                        />
                    </div>

                    <p className="text-sm text-gray-300 mb-4">
                        Video call is not active.
                    </p>

                    <button
                        onClick={joinVideoCall}
                        disabled={isJoining}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                            isJoining
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#bbb8ff] hover:bg-[#aaaaff] text-black'
                        }`}
                    >
                        {isJoining
                            ? 'Joining...'
                            : 'Join Video Call'}
                    </button>

                </div>
            )}

            {/* Joined call */}
            {isJoined && (
                <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">

                    {/* Local video */}
                    <div className="w-full aspect-video">
                        <div className="relative w-full h-full bg-[#393E46] rounded-lg overflow-hidden">

                            <div
                                id={`local-player-${localUid}`}
                                className="w-full h-full"
                            />

                            {!isVideoEnabled && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#393E46]">
                                    <div className="w-16 h-16 rounded-full bg-[#2b2f36] flex items-center justify-center text-xl">
                                        {username
                                            ? username
                                                .charAt(0)
                                                .toUpperCase()
                                            : 'U'}
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded flex items-center gap-2">
                                <span>
                                    You ({username})
                                </span>

                                {!isVideoEnabled && (
                                    <FontAwesomeIcon
                                        icon={faVideoSlash}
                                    />
                                )}

                                {!isAudioEnabled && (
                                    <FontAwesomeIcon
                                        icon={faMicrophoneSlash}
                                    />
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Remote users */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">

                        {remoteUsers.map((user) => {
                            const state =
                                remoteMediaState.get(
                                    user.uid
                                ) || {
                                    hasVideo:
                                        !!user.videoTrack,
                                    hasAudio:
                                        !!user.audioTrack
                                };

                            const displayName =
                                participants[user.uid] ||
                                `User ${user.uid}`;

                            return (
                                <div
                                    key={user.uid}
                                    className="relative aspect-video bg-[#393E46] rounded-lg overflow-hidden"
                                >

                                    <div
                                        id={`remote-player-${user.uid}`}
                                        className="w-full h-full"
                                    />

                                    {!state.hasVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#393E46]">
                                            <div className="w-16 h-16 rounded-full bg-[#2b2f36] flex items-center justify-center text-xl">
                                                {displayName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded flex items-center gap-2">

                                        <span>
                                            {displayName}
                                        </span>

                                        {!state.hasVideo && (
                                            <FontAwesomeIcon
                                                icon={faVideoSlash}
                                            />
                                        )}

                                        {!state.hasAudio && (
                                            <FontAwesomeIcon
                                                icon={
                                                    faMicrophoneSlash
                                                }
                                            />
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* Leave button */}
                    <button
                        onClick={leaveVideoCall}
                        className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPhone} />
                        Leave Video Call
                    </button>

                </div>
            )}

        </div>
    );
};

export default VideoCall;