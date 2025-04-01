import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

const APP_ID = "3f648a39f1064e5eaf77adbe6ec066bc";

const VideoCall = ({ roomId, username }) => {
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [joinState, setJoinState] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [localUid, setLocalUid] = useState(null);
    const [userNames, setUserNames] = useState(new Map());

    const client = React.useMemo(() => AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8"
    }), []);

    useEffect(() => {
        const init = async () => {
            client.on("user-published", handleUserPublished);
            client.on("user-unpublished", handleUserUnpublished);

            // Generate a uid from the username to keep it consistent
            const uid = Math.abs(username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
            setLocalUid(uid);

            await client.join(APP_ID, roomId, null, uid);

            // Set the username for the local user
            setUserNames(prev => new Map(prev).set(uid, username));

            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            const videoTrack = await AgoraRTC.createCameraVideoTrack();

            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);
            setJoinState(true);

            // Send username along with tracks
            await client.publish([audioTrack, videoTrack]);
            
            // Broadcast username to other users
            client.sendStreamMessage(new TextEncoder().encode(JSON.stringify({
                type: 'username',
                uid: uid,
                username: username
            })));

            videoTrack.play(`local-player-${uid}`);
        };

        init().catch(error => {
            console.error("Error initializing video call:", error);
            if (error.message === "PERMISSION_DENIED") {
                alert("Please allow camera and microphone permissions to join the video call.");
            }
        });

        // Listen for username messages
        client.on("stream-message", (uid, data) => {
            try {
                const message = JSON.parse(new TextDecoder().decode(data));
                if (message.type === 'username') {
                    setUserNames(prev => new Map(prev).set(message.uid, message.username));
                }
            } catch (error) {
                console.error("Error parsing username message:", error);
            }
        });

        return () => {
            handleLeave();
        };
    }, [client, roomId, username]);

    const handleUserPublished = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
            setRemoteUsers(prev => {
                if (prev.find(u => u.uid === user.uid)) {
                    return prev.map(u => {
                        if (u.uid === user.uid) return user;
                        return u;
                    });
                }
                return [...prev, user];
            });
            
            // Request username from the new user
            client.sendStreamMessage(new TextEncoder().encode(JSON.stringify({
                type: 'username',
                uid: localUid,
                username: username
            })));
            
            setTimeout(() => {
                const element = document.getElementById(`remote-player-${user.uid}`);
                if (element) {
                    user.videoTrack?.play(`remote-player-${user.uid}`);
                }
            }, 100);
        }
        if (mediaType === "audio") {
            user.audioTrack?.play();
        }
    };

    const handleUserUnpublished = (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        // Remove username when user leaves
        setUserNames(prev => {
            const newMap = new Map(prev);
            newMap.delete(user.uid);
            return newMap;
        });
    };

    const handleLeave = async () => {
        if (localAudioTrack) {
            localAudioTrack.close();
        }
        if (localVideoTrack) {
            localVideoTrack.close();
        }
        setRemoteUsers([]);
        setJoinState(false);
        setUserNames(new Map());
        await client.leave();
    };

    const toggleAudio = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#232329] text-white overflow-hidden">
            <div className="p-2 flex-shrink-0 flex justify-between items-center">
                <p className="text-lg text-[#bbb8ff] mb-0">Video Call</p>
                <div className="flex gap-2">
                    <button
                        onClick={toggleAudio}
                        className={`p-1.5 rounded-full w-7 h-7 flex items-center justify-center ${isAudioEnabled ? 'bg-[#bbb8ff] hover:bg-[#a5a2ff]' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                        title={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
                    >
                        <FontAwesomeIcon 
                            icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash}
                            className={`text-xs ${isAudioEnabled ? 'text-black' : 'text-white'}`}
                        />
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`p-1.5 rounded-full w-7 h-7 flex items-center justify-center ${isVideoEnabled ? 'bg-[#bbb8ff] hover:bg-[#a5a2ff]' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                        title={isVideoEnabled ? "Turn Off Video" : "Turn On Video"}
                    >
                        <FontAwesomeIcon 
                            icon={isVideoEnabled ? faVideo : faVideoSlash}
                            className={`text-xs ${isVideoEnabled ? 'text-black' : 'text-white'}`}
                        />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                {/* Local user video (always at top) */}
                {joinState && (
                    <div className="w-full aspect-video">
                        <div className="relative w-full h-full bg-[#393E46] rounded-lg overflow-hidden">
                            <div id={`local-player-${localUid}`} className="w-full h-full object-cover"></div>
                            <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded flex items-center gap-2">
                                <span>You ({username})</span>
                                {!isVideoEnabled && <FontAwesomeIcon icon={faVideoSlash} />}
                                {!isAudioEnabled && <FontAwesomeIcon icon={faMicrophoneSlash} />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Remote users grid */}
                <div className={`grid ${remoteUsers.length > 2 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 flex-1`}>
                    {remoteUsers.map(user => (
                        <div key={user.uid} className="relative aspect-video bg-[#393E46] rounded-lg overflow-hidden">
                            <div 
                                id={`remote-player-${user.uid}`}
                                className="w-full h-full"
                            ></div>
                            <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                                {userNames.get(user.uid) || `User ${user.uid}`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoCall; 