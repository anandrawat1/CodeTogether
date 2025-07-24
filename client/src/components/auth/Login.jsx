import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import validator from 'validator';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validator.isEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (!data.success) {
                toast.error(data.message || 'Failed to login');
                return;
            }

            await login(data.user);
            toast.success('Login successful!');
            navigate('/my-room');
            
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            toast.error('Failed to login');
        }
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter' && email && password) {
            handleLogin(e);
        }
    };

    return (
        <div>
            <div className="space-y-4">
                <input
                    type="email"
                    className="w-full px-4 py-2 bg-[#2A2A30] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyUp={handleInputEnter}
                />
                <input
                    type="password"
                    className="w-full px-4 py-2 bg-[#2A2A30] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={handleInputEnter}
                />
                <button 
                    className={`w-full bg-[#bbb8ff] font-semibold text-black py-2 px-4 rounded-md hover:bg-[#aaaaff] transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default Login; 