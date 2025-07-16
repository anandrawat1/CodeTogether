import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import validator from 'validator';

const Signup = ({ setView }) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validator.isEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        try {
            setIsLoading(true);
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (!data.success) {
                toast.error(data.message || 'Failed to create account');
                return;
            }

            toast.success('Account created successfully!');
            setView('login');
            
        } catch (error) {
            console.error('Signup error:', error);
            setIsLoading(false);
            toast.error('Failed to create account');
        }
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter' && firstName && lastName && email && password) {
            handleSignup(e);
        }
    };

    return (
        <div>
            <div className="space-y-4">
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#2A2A30] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyUp={handleInputEnter}
                />
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#2A2A30] text-white rounded-md focus:outline-none placeholder-gray-400"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyUp={handleInputEnter}
                />
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
                    className={`w-full bg-[#bbb8ff] text-black py-2 px-4 rounded-md hover:bg-[#aaaaff] transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSignup}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};

export default Signup; 