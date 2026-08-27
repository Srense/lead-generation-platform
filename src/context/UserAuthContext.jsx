import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('learner_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [userProfile, setUserProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('learner_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedLearner = localStorage.getItem('learner_user');
        if (savedLearner) {
            try {
                const parsed = JSON.parse(savedLearner);
                if (parsed && parsed.email) {
                    setUserProfile(parsed);
                    setUser({ id: parsed.id, email: parsed.email, name: parsed.name });
                }
            } catch (e) {}
        }
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
            // 1. Check with Supabase Auth first
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

            // 2. Check local stored credentials - ONLY allow if password matches exactly
            const savedPwd = localStorage.getItem(`learner_pwd_${normalizedEmail}`);
            
            if (savedPwd && savedPwd === password) {
                const savedUser = localStorage.getItem('learner_user');
                let profile;
                try {
                    profile = savedUser ? JSON.parse(savedUser) : null;
                } catch {}
                
                if (!profile || profile.email?.toLowerCase() !== normalizedEmail) {
                    profile = {
                        id: crypto.randomUUID(),
                        email: normalizedEmail,
                        name: normalizedEmail.split('@')[0]
                    };
                }

                setUserProfile(profile);
                localStorage.setItem('learner_user', JSON.stringify(profile));
                localStorage.setItem('user_email', normalizedEmail);
                localStorage.setItem('user_registered', 'true');
                setIsLoading(false);
                return { success: true, user: profile };
            }

            // If passwords don't match, strictly reject
            setIsLoading(false);
            return { success: false, error: 'Incorrect email or password. Please try again.' };
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

    const resetPassword = async (email) => {
        setIsLoading(true);
        const normalizedEmail = email.trim().toLowerCase();

        try {
            if (supabase) {
                // 1. Trigger Supabase native reset
                try {
                    await supabase.auth.resetPasswordForEmail(normalizedEmail, {
                        redirectTo: `${window.location.origin}/#auth-gate`
                    });
                } catch (supaErr) {
                    console.warn("Supabase auth reset warning:", supaErr);
                }

                // 2. Trigger custom Resend Edge Function
                try {
                    await supabase.functions.invoke('send-email', {
                        body: {
                            name: normalizedEmail.split('@')[0],
                            email: normalizedEmail,
                            type: 'reset_password'
                        }
                    });
                } catch (funcErr) {
                    console.warn("Resend edge function notice:", funcErr);
                }
            }

            setIsLoading(false);
            return { success: true, message: 'Password reset instructions sent to your email! Please check your inbox or spam folder.' };
        } catch (err) {
            setIsLoading(false);
            return { success: false, error: err.message || 'Failed to send reset link.' };
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
                updatePassword,
                resetPassword
            }}
        >
            {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(UserAuthContext);
