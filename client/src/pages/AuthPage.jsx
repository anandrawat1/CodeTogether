import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
const Auth = () => {
    const [view, setView] = useState('login');

    return (
        <>
        <Navbar />  
        <div className="h-[calc(100vh-3.5rem)] bg-[#232329] flex">
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#bbb8ff]/80 to-[#9d99ff]/80 z-10"></div>
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
                    }}
                ></div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        {view === 'signup' ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {view === 'signup' 
                            ? "Join our collaborative coding platform" 
                            : "Login to continue coding together"}
                    </p>

                    {/* Main form content */}
                    {view === 'login' ? <Login /> : <Signup setView={setView} />}

                    {/* Toggle view option */}
                    <div className="mt-6">
                        <span className="text-gray-400">
                            {view === 'signup' 
                                ? "Already have an account? " 
                                : "Don't have an account? "}
                        </span>
                        <button
                            onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
                            className="text-[#bbb8ff] hover:text-[#aaaaff] transition-colors duration-200"
                        >
                            {view === 'signup' ? 'Login' : 'Sign up'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Auth; 