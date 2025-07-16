import React, { useState } from 'react';
import CreateRoom from '../components/room/CreateRoom';
import JoinRoom from '../components/room/JoinRoom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSearchParams } from 'react-router-dom';

const Room = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const [view, setView] = useState(mode === 'create' ? 'create' : 'join');

    return (
        <>
        <Navbar />
        <div className="h-[calc(100vh-3.5rem)] bg-[#232329] flex">
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b  overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#bbb8ff]/80 to-[#9d99ff]/80 z-10"></div>
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80')`,
                    }}
                    
                >  
                </div>
            </div>
            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        {view === 'create' ? 'Create Room' : 'Join Room'}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {view === 'create' 
                            ? "Set up a new collaborative coding room" 
                            : "Join an existing coding session"}
                    </p>

                    {/* Main form content */}
                    {view === 'join' ? <JoinRoom /> : <CreateRoom />}

                    {/* Toggle view option */}
                    <div className="mt-6">
                        <span className="text-gray-400">
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
            </div>
        </div>
        <Footer />
    </>
    );
};

export default Room; 