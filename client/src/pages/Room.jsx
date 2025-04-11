import React, { useState } from 'react';
import CreateRoom from '../components/room/CreateRoom';
import JoinRoom from '../components/room/JoinRoom';
import Navbar from '../components/Navbar';


const Room = () => {
    const [view, setView] = useState('join');

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#232329] flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#393E46] rounded-lg shadow-xl p-8">
                {view === 'join' ? <JoinRoom /> : <CreateRoom />}
                
                <div className="mt-6 text-center">
                    <span className="text-gray-400 mb-2">
                        {view === 'create' 
                            ? "Already have an invite? " 
                            : "Don't have an invite? "}
                    </span>
                    <button
                        onClick={() => setView(view === 'create' ? 'join' : 'create')}
                        className="text-[#bbb8ff] hover:text-[#aaaaff] transition-colors duration-200"
                    >
                        {view === 'create' ? 'Join Room' : 'Create Room'}
                    </button>
                </div>
            </div>

            <footer className="mt-3 text-gray-700 text-sm">
                <p className="text-center">
                    Built for collaborative coding. <br /> © {new Date().getFullYear()} | &nbsp;
                    <a 
                        href="https://github.com/shomik-das" 
                        className="text-[#bbb8ff] hover:text-[#aaaaff] transition-colors duration-200"
                    >
                        shomik das
                    </a>
                </p>
            </footer>
        </div>
        </>
    );
};

export default Room; 