import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);
    //with out itAfter refreshing the page, your React app will think the user is logged out, even though they still have a valid session in the backend.
    // Navbar will show the Login button instead of the user icon, unless you manually login again.

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 