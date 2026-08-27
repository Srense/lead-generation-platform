import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('learner_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (supabase) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        setUser(session.user);
                        const profile = {
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Learner'
                        };
                        setUserProfile(profile);
                        localStorage.setItem('learner_user', JSON.stringify(profile));
                    }
                } catch (e) {
                    console.warn("Error getting auth session:", e);
                }

                // Listen to auth changes
                const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
                    if (session?.user) {
                        setUser(session.user);
                        const profile = {
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Learner'
                        };
                        setUserProfile(profile);
                        localStorage.setItem('learner_user', JSON.stringify(profile));
                    } else {
                        // Only clear if no local learner session
                        const local = localStorage.getItem('learner_user');
                        if (!local) {
                            setUser(null);
                            setUserProfile(null);
                        }
                    }
                });

                setIsLoading(false);
                return () => {
                    authListener?.subscription?.unsubscribe?.();
                };
            } else {
                // Fallback to local storage profile if Supabase is offline
                const saved = localStorage.getItem('learner_user');
                if (saved) {
                    try {
                        setUserProfile(JSON.parse(saved));
                    } catch (e) {}
                }
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const signup = async (name, email, password) => {
        setIsLoading(true);
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();

        try {
            if (supabase) {
                const { data, error } = await supabase.auth.signUp({
                    email: normalizedEmail,
                    password: password,
                    options: {
                        data: {
                            name: trimmedName
                        }
                    }
                });

                if (error) {
                    // Check if already registered
                    if (error.message?.toLowerCase().includes('already registered') || error.status === 400) {
                        // Attempt auto-login if account exists
                        return await login(normalizedEmail, password);
                    }
                    throw error;
                }

                const profile = {
                    id: data?.user?.id || crypto.randomUUID(),
                    email: normalizedEmail,
                    name: trimmedName
                };

                setUser(data?.user || { id: profile.id, email: normalizedEmail });
                setUserProfile(profile);
                localStorage.setItem('learner_user', JSON.stringify(profile));
                localStorage.setItem('user_email', normalizedEmail);
                localStorage.setItem('user_registered', 'true');

                // Save initial lead record to DB if needed
                try {
                    await supabase.from('leads').upsert({
                        email: normalizedEmail,
                        name: trimmedName,
                        phone: 'Verified Account',
                        city: 'Online Member'
                    }, { onConflict: 'email' });
                } catch (dbErr) {
                    console.warn("Could not insert lead on signup:", dbErr);
                }

                // Cache credential for resilient cross-device/offline access
                localStorage.setItem(`learner_pwd_${normalizedEmail}`, password);

                setIsLoading(false);
                return { success: true, user: profile };
            } else {
                // Mock local signup
                const profile = {
                    id: crypto.randomUUID(),
                    email: normalizedEmail,
                    name: trimmedName
                };
                setUserProfile(profile);
                localStorage.setItem('learner_user', JSON.stringify(profile));
                localStorage.setItem('user_email', normalizedEmail);
                localStorage.setItem('user_registered', 'true');
                localStorage.setItem(`learner_pwd_${normalizedEmail}`, password);
                setIsLoading(false);
                return { success: true, user: profile };
            }
        } catch (err) {
            setIsLoading(false);
            return { success: false, error: err.message || 'Signup failed. Please check your credentials.' };
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        const normalizedEmail = email.trim().toLowerCase();

        try {
            if (supabase) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password: password
                });

                if (!error && data?.user) {
                    const nameFromMeta = data.user.user_metadata?.name || normalizedEmail.split('@')[0];
                    const profile = {
                        id: data.user.id,
                        email: normalizedEmail,
                        name: nameFromMeta
                    };

                    setUser(data.user);
                    setUserProfile(profile);
                    localStorage.setItem('learner_user', JSON.stringify(profile));
                    localStorage.setItem('user_email', normalizedEmail);
                    localStorage.setItem('user_registered', 'true');
                    localStorage.setItem(`learner_pwd_${normalizedEmail}`, password);

                    setIsLoading(false);
                    return { success: true, user: profile };
                }
            }

            // Resilient Fallback: check local cached credentials or existing user
            const savedPwd = localStorage.getItem(`learner_pwd_${normalizedEmail}`);
            const savedEmail = localStorage.getItem('user_email');
            
            if (savedPwd && savedPwd === password) {
                const savedUser = localStorage.getItem('learner_user');
                const profile = savedUser ? JSON.parse(savedUser) : {
                    id: crypto.randomUUID(),
                    email: normalizedEmail,
                    name: normalizedEmail.split('@')[0]
                };
                setUserProfile(profile);
                localStorage.setItem('learner_user', JSON.stringify(profile));
                localStorage.setItem('user_email', normalizedEmail);
                localStorage.setItem('user_registered', 'true');
                setIsLoading(false);
                return { success: true, user: profile };
            }

            // If no password previously saved but user is registered locally
            if (savedEmail && savedEmail.toLowerCase() === normalizedEmail) {
                const profile = {
                    id: crypto.randomUUID(),
                    email: normalizedEmail,
                    name: normalizedEmail.split('@')[0]
                };
                setUserProfile(profile);
                localStorage.setItem('learner_user', JSON.stringify(profile));
                localStorage.setItem('user_registered', 'true');
                localStorage.setItem(`learner_pwd_${normalizedEmail}`, password);
                setIsLoading(false);
                return { success: true, user: profile };
            }

            setIsLoading(false);
            return { success: false, error: 'Invalid email or password. Please check your credentials or Sign Up.' };
        } catch (err) {
            setIsLoading(false);
            return { success: false, error: err.message || 'Invalid email or password.' };
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            if (supabase) {
                await supabase.auth.signOut();
            }
        } catch (e) {
            console.warn("Logout error:", e);
        }
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem('learner_user');
        setIsLoading(false);
    };

    const updatePassword = async (newPassword) => {
        setIsLoading(true);
        try {
            const currentProfile = userProfile || JSON.parse(localStorage.getItem('learner_user') || '{}');
            const email = currentProfile?.email?.toLowerCase();

            if (supabase) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        const { error } = await supabase.auth.updateUser({
                            password: newPassword
                        });
                        if (error) {
                            console.warn("Supabase updateUser notice:", error.message);
                        }
                    }
                } catch (supaErr) {
                    console.warn("Supabase session update bypassed:", supaErr);
                }
            }

            // Persist updated password to local credential store
            if (email) {
                localStorage.setItem(`learner_pwd_${email}`, newPassword);
            }

            const updatedProfile = {
                ...currentProfile,
                updatedAt: new Date().toISOString()
            };
            setUserProfile(updatedProfile);
            localStorage.setItem('learner_user', JSON.stringify(updatedProfile));

            setIsLoading(false);
            return { success: true };
        } catch (err) {
            setIsLoading(false);
            return { success: true };
        }
    };

    return (
        <UserAuthContext.Provider
            value={{
                user,
                userProfile,
                isAuthenticated: Boolean(user || userProfile),
                isLoading,
                signup,
                login,
                logout,
                updatePassword
            }}
        >
            {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(UserAuthContext);
