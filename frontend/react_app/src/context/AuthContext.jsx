import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null); // Force login-first: Don't load from localStorage on init

    // Load user on startup or token change
    const loadUser = async (authToken) => {
        if (!authToken) {
            setLoading(false);
            return;
        }

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            const res = await axios.get('/api/auth/me');

            if (res.data.success) {
                setUser(res.data.data);
                localStorage.setItem('user', JSON.stringify(res.data.data));
            } else {
                logout();
            }
        } catch (err) {
            console.error('User load failed:', err.message);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadUser(token);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            if (res.data.success) {
                setToken(res.data.token);
                // User will be loaded by the useEffect hook
                return { success: true, user: res.data.user };
            }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('/api/auth/register', userData);
            if (res.data.success && res.data.token) {
                setToken(res.data.token);
                return { success: true, user: res.data.user };
            }
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Registration failed'
            };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const res = await axios.post('/api/auth/verify-otp', { email, otp });
            if (res.data.success && res.data.token) {
                setToken(res.data.token);
            }
            return res.data;
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Verification failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
