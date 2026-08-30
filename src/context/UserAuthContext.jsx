import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchUserCloudProgress } from '../lib/userProgressSync';

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

        if (supabase) {
            // Check active session from Supabase
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    const normalizedEmail = session.user.email?.toLowerCase();
                    const nameFromMeta = session.user.user_metadata?.name || normalizedEmail?.split('@')[0] || 'Learner';
                    const profile = {
                        id: session.user.id,
                        email: normalizedEmail,
                        name: nameFromMeta
                    };
                    setUser(session.user);
                    setUserProfile(profile);
                    localStorage.setItem('learner_user', JSON.stringify(profile));
                    localStorage.setItem('user_email', normalizedEmail);
                    localStorage.setItem('user_registered', 'true');
                    localStorage.setItem('first_video_completed', 'true');
                    localStorage.setItem(`first_video_completed_${normalizedEmail}`, 'true');

                    fetchUserCloudProgress(normalizedEmail);
                }
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    const normalizedEmail = session.user.email?.toLowerCase();
                    const nameFromMeta = session.user.user_metadata?.name || normalizedEmail?.split('@')[0] || 'Learner';
                    const profile = {
                        id: session.user.id,
                        email: normalizedEmail,
                        name: nameFromMeta
                    };
                    setUser(session.user);
                    setUserProfile(profile);
                    localStorage.setItem('learner_user', JSON.stringify(profile));
                    localStorage.setItem('user_email', normalizedEmail);
                    localStorage.setItem('user_registered', 'true');
                    localStorage.setItem('first_video_completed', 'true');
                    localStorage.setItem(`first_video_completed_${normalizedEmail}`, 'true');

                    fetchUserCloudProgress(normalizedEmail);
                }
            });

            return () => subscription?.unsubscribe();
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
                    setIsLoading(false);
                    return { success: false, error: error.message };
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

                // Save lead record to DB
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

                setIsLoading(false);
                return { success: true, user: profile };
            } else {
                setIsLoading(false);
                return { success: false, error: 'Database connection offline.' };
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

                if (error) {
                    // Clean up any stale local data if credentials are not valid in Supabase
                    localStorage.removeItem('learner_user');
                    setUserProfile(null);
                    setUser(null);
                    setIsLoading(false);
                    return { success: false, error: error.message || 'Invalid email or password.' };
                }

                if (data?.user) {
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
                    localStorage.setItem('first_video_completed', 'true');
                    localStorage.setItem(`first_video_completed_${normalizedEmail}`, 'true');

                    // Restore cloud progress across browsers
                    try {
                        await fetchUserCloudProgress(normalizedEmail);
                    } catch (pErr) {
                        console.warn("Cloud progress restoration notice:", pErr);
                    }

                    setIsLoading(false);
                    return { success: true, user: profile };
                }
            }

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

    const updatePassword = async (newPassword, emailTarget) => {
        setIsLoading(true);
        const email = (emailTarget || userProfile?.email || localStorage.getItem('user_email') || '').trim().toLowerCase();

        try {
            if (supabase) {
                // 1. Try standard Supabase session update first
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        const { data, error } = await supabase.auth.updateUser({
                            password: newPassword
                        });
                        if (!error && data?.user) {
                            const profile = {
                                id: data.user.id,
                                email: data.user.email,
                                name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Learner'
                            };
                            setUser(data.user);
                            setUserProfile(profile);
                            localStorage.setItem('learner_user', JSON.stringify(profile));
                            localStorage.setItem('user_email', profile.email);
                            localStorage.setItem('user_registered', 'true');
                            setIsLoading(false);
                            return { success: true };
                        }
                    }
                } catch (sessErr) {
                    console.warn("Session update check notice:", sessErr);
                }

                // 2. Direct Cloud Password Update via Edge Function (eliminates "Auth session missing")
                if (email) {
                    try {
                        const { data: funcData, error: funcErr } = await supabase.functions.invoke('send-email', {
                            body: {
                                type: 'direct_password_update',
                                email: email,
                                new_password: newPassword
                            }
                        });

                        if (!funcErr) {
                            // Automatically sign in with the new credentials
                            return await login(email, newPassword);
                        }
                    } catch (e) {
                        console.warn("Edge function password update notice:", e);
                    }
                }
            }

            // 3. If email provided, attempt direct login with new credentials
            if (email) {
                return await login(email, newPassword);
            }

            setIsLoading(false);
            return { success: false, error: 'Please enter your registered email address.' };
        } catch (err) {
            setIsLoading(false);
            return { success: false, error: err.message || 'Password update failed' };
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
                        redirectTo: 'https://harshbahti.in/#reset-password'
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
