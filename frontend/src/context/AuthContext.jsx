import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            if (isTokenValid(token)) {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);

        // Decode token to get role if not provided in userData (API response might vary)
        // The API response for login is { message, token }
        // We decode the token to get role and identity
        const decoded = jwtDecode(token);

        // Construct user object
        const userObj = {
            ...userData, // might be empty initially
            role: decoded.role,
            id: decoded.identity
            // Add other fields if encoded in token or returned by API
        };

        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isTokenValid = (token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
