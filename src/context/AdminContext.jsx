import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            // If Supabase is connected, utilize Secure Session API
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) setIsAuthenticated(true);

                // Listen strictly for token changes dynamically
                supabase.auth.onAuthStateChange((_event, session) => {
                    setIsAuthenticated(!!session);
                });
            } else {
                // Fallback: Check if auth token exists in sessionStorage to persist login
                const token = sessionStorage.getItem('adminToken');
                if (token === 'secure_mock_token_123') setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        checkAuthStatus();
    }, []);

    const login = async (username, password) => {
        if (supabase) {
            const { error } = await supabase.auth.signInWithPassword({
                email: username,
                password: password
            });
            if (!error) return true;
            return false;
        } else {
            // Simulate secure login endpoint
            if (username === 'admin' && password === 'securepassword') {
                sessionStorage.setItem('adminToken', 'secure_mock_token_123');
                setIsAuthenticated(true);
                return true;
            }
            return false;
        }
    };

    const logout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        } else {
            sessionStorage.removeItem('adminToken');
            setIsAuthenticated(false);
        }
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
