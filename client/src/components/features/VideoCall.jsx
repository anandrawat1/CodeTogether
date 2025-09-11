import React, { useEffect, useState, useMemo } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faUser } from '@fortawesome/free-solid-svg-icons';

const APP_ID = import.meta.env.VITE_VIDEO_CALL_APP_ID;

const VideoCall = ({ roomId, username, participants = {} }) => {
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [joinState, setJoinState] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [localUid, setLocalUid] = useState(null);
    const [remoteMediaState, setRemoteMediaState] = useState(new Map()); // uid -> { hasVideo, hasAudio }
    const joinedRef = React.useRef(false);

    const client = useMemo(() => AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8"
    }), []);

    // Function to handle user published
    const handleUserPublished = async (user, mediaType) => {
        try {
            await client.subscribe(user, mediaType);
        } catch (e) {
            console.error('Subscribe failed:', e);
            return;
        }
        if (mediaType === "video") {
            setRemoteUsers(prev => {
                const existingUser = prev.find(u => u.uid === user.uid);
                if (existingUser) {
                    return prev.map(u => u.uid === user.uid ? { ...u, videoTrack: user.videoTrack } : u);
                }
                return [...prev, { ...user }];
            });
            setRemoteMediaState(prev => {
                const m = new Map(prev);
                const before = m.get(user.uid) || { hasVideo: false, hasAudio: false };
                m.set(user.uid, { ...before, hasVideo: true });
                return m;
            });
            setTimeout(() => user.videoTrack?.play(`remote-player-${user.uid}`), 100);
        }
        if (mediaType === "audio") {
            user.audioTrack?.play();
            setRemoteMediaState(prev => {
                const m = new Map(prev);
                const before = m.get(user.uid) || { hasVideo: false, hasAudio: false };
                m.set(user.uid, { ...before, hasAudio: true });
                return m;
            });
        }
    };

    // Function to handle user unpublished
    const handleUserUnpublished = (user, mediaType) => {
        if (mediaType === 'video') {
            setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, videoTrack: null } : u));
            setRemoteMediaState(prev => {
                const m = new Map(prev);
                const before = m.get(user.uid) || { hasVideo: false, hasAudio: false };
                m.set(user.uid, { ...before, hasVideo: false });
                return m;
            });
        } else if (mediaType === 'audio') {
            setRemoteMediaState(prev => {
                const m = new Map(prev);
                const before = m.get(user.uid) || { hasVideo: false, hasAudio: false };
                m.set(user.uid, { ...before, hasAudio: false });
                return m;
            });
        }
    };

    const handleUserLeft = (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        setRemoteMediaState(prev => {
            const m = new Map(prev);
            m.delete(user.uid);
            return m;
        });
    };

    // Main effect for Agora initialization and cleanup
    useEffect(() => {
        const init = async () => {
            try {
                const uid = Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
                setLocalUid(uid);

                client.on("user-published", handleUserPublished);
                client.on("user-unpublished", handleUserUnpublished);
                client.on("user-left", handleUserLeft);

                if (!joinedRef.current) {
                    try {
                        await client.join(APP_ID, roomId, null, uid);
                        joinedRef.current = true;
                    } catch (err) {
                        console.error('Failed to join channel:', err);
                        // Only alert if we truly failed and didn't join
                        if (!joinedRef.current) alert('Failed to join video channel. Please try again.');
                        return;
                    }
                }

                const audioTrack = await AgoraRTC.createMicrophoneAudioTrack().catch(e => { console.error(e); return null; });
                const videoTrack = await AgoraRTC.createCameraVideoTrack().catch(e => { console.error(e); return null; });

                if (audioTrack) setLocalAudioTrack(audioTrack);
                if (videoTrack) setLocalVideoTrack(videoTrack);
                setJoinState(true);

                const publishTracks = [audioTrack, videoTrack].filter(Boolean);
                if (publishTracks.length) {
                    try { await client.publish(publishTracks); } catch (e) { console.error('Publish failed', e); }
                }
                if (videoTrack) {
                    videoTrack.play(`local-player-${uid}`);
                }

            } catch (error) {
                console.error("Error initializing video call:", error);
                if (error.message.includes("PERMISSION_DENIED")) {
                    alert("Please allow camera and microphone permissions to join the video call.");
                }
            }
        };

        init();

        return () => {
            const leave = async () => {
                client.off("user-published", handleUserPublished);
                client.off("user-unpublished", handleUserUnpublished);
                client.off("user-left", handleUserLeft);
                try {
                    const tracks = [localAudioTrack, localVideoTrack].filter(Boolean);
                    if (tracks.length) {
                        try { await client.unpublish(tracks); } catch (_) {}
                        tracks.forEach(t => {
                            try { t.stop && t.stop(); } catch (_) {}
                            try { t.close && t.close(); } catch (_) {}
                        });
                    }
                } finally {
                    await client.leave().catch(() => {});
                    setJoinState(false);
                    setRemoteUsers([]);
                    setRemoteMediaState(new Map());
                    joinedRef.current = false;
                }
            };
            leave();
        };
    }, [client, roomId, username]);

    const toggleMedia = async (track, isEnabled, setIsEnabled, mediaType) => {
        if (track) {
            await track.setEnabled(!isEnabled);
            setIsEnabled(!isEnabled);
        }
    };

    const toggleAudio = () => toggleMedia(localAudioTrack, isAudioEnabled, setIsAudioEnabled, 'audio');
    const toggleVideo = () => toggleMedia(localVideoTrack, isVideoEnabled, setIsVideoEnabled, 'video');

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
            <div className="p-2 flex-shrink-0 flex justify-between items-center">
                <p className="text-lg text-[#bbb8ff] mb-0">Video Call</p>
                <div className="flex gap-2">
                    <button
                        onClick={toggleAudio}
                        className={`p-1.5 rounded-full w-7 h-7 flex items-center justify-center ${isAudioEnabled ? 'bg-[#bbb8ff] hover:bg-[#a5a2ff]' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                        title={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
                    >
                        <FontAwesomeIcon icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash} className={`text-xs ${isAudioEnabled ? 'text-black' : 'text-white'}`} />
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`p-1.5 rounded-full w-7 h-7 flex items-center justify-center ${isVideoEnabled ? 'bg-[#bbb8ff] hover:bg-[#a5a2ff]' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                        title={isVideoEnabled ? "Turn Off Video" : "Turn On Video"}
                    >
                        <FontAwesomeIcon icon={isVideoEnabled ? faVideo : faVideoSlash} className={`text-xs ${isVideoEnabled ? 'text-black' : 'text-white'}`} />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                {joinState && (
                    <div className="w-full aspect-video">
                        <div className="relative w-full h-full bg-[#393E46] rounded-lg overflow-hidden">
                            <div id={`local-player-${localUid}`} className="w-full h-full object-cover"></div>
                            {!isVideoEnabled && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#393E46]">
                                    <div className="w-16 h-16 rounded-full bg-[#2b2f36] flex items-center justify-center text-xl">
                                        {username ? username.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded flex items-center gap-2">
                                <span>You ({username})</span>
                                {!isVideoEnabled && <FontAwesomeIcon icon={faVideoSlash} />}
                                {!isAudioEnabled && <FontAwesomeIcon icon={faMicrophoneSlash} />}
                            </div>
                        </div>
                    </div>
                )}

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 content-start`}>
                    {remoteUsers.map(user => {
                        const state = remoteMediaState.get(user.uid) || { hasVideo: !!user.videoTrack, hasAudio: !!user.audioTrack };
                        const displayName = participants[user.uid] || `User ${user.uid}`;
                        return (
                            <div key={user.uid} className="relative aspect-video bg-[#393E46] rounded-lg overflow-hidden">
                                <div id={`remote-player-${user.uid}`} className="w-full h-full"></div>
                                {!state.hasVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#393E46]">
                                        <div className="w-16 h-16 rounded-full bg-[#2b2f36] flex items-center justify-center text-xl">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded flex items-center gap-2">
                                    <span>{displayName}</span>
                                    {!state.hasVideo && <FontAwesomeIcon icon={faVideoSlash} />}
                                    {!state.hasAudio && <FontAwesomeIcon icon={faMicrophoneSlash} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VideoCall;