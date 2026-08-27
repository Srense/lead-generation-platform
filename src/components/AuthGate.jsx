import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import Loader from './Loader';

export default function AuthGate({ onSuccess }) {
    const [mode, setMode] = useState('signup'); // 'signup' | 'login'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup, login } = useUserAuth();

    const handleChange = (e) => {
        setError(null);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (mode === 'signup') {
            if (!formData.name.trim()) {
                setError('Please enter your full name.');
                return;
            }
            if (!formData.email.trim()) {
                setError('Please enter your email address.');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match. Please verify.');
                return;
            }

            setIsSubmitting(true);
            const res = await signup(formData.name, formData.email, formData.password);
            setIsSubmitting(false);

            if (res.success) {
                if (onSuccess) onSuccess(res.user);
            } else {
                setError(res.error || 'Signup failed.');
            }
        } else {
            if (!formData.email.trim() || !formData.password) {
                setError('Please enter both email and password.');
                return;
            }

            setIsSubmitting(true);
            const res = await login(formData.email, formData.password);
            setIsSubmitting(false);

            if (res.success) {
                if (onSuccess) onSuccess(res.user);
            } else {
                setError(res.error || 'Invalid credentials.');
            }
        }
    };

    return (
        <div id="auth-gate" className="w-full max-w-2xl mx-auto my-12 px-2 sm:px-4">
            <div className="floral-glass-heavy rounded-3xl p-6 sm:p-10 ambient-shadow relative overflow-hidden border border-white/10">
                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 blur-[90px] rounded-full pointer-events-none -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/15 blur-[90px] rounded-full pointer-events-none -z-10"></div>

                {/* Header Lock Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-[0_0_25px_rgba(16,185,129,0.3)] mb-4">
                        <span className="material-symbols-outlined text-3xl">
                            {mode === 'signup' ? 'person_add' : 'lock_open'}
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                        Member Access Required
                    </div>

                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                        {mode === 'signup' ? 'Create Free Learning Account' : 'Welcome Back, Learner'}
                    </h2>
                    <p className="text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                        {mode === 'signup'
                            ? 'Unlock the 2nd Why Session, personalized progress tracking, and full Bootcamp Masterclass modules for free.'
                            : 'Sign in to automatically restore your video progress and resume where you left off.'}
                    </p>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="flex bg-black/40 border border-white/10 p-1 rounded-2xl mb-8 max-w-sm mx-auto">
                    <button
                        type="button"
                        onClick={() => { setMode('signup'); setError(null); }}
                        className={`flex-1 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            mode === 'signup'
                                ? 'bg-primary text-black shadow-lg'
                                : 'text-on-surface-variant hover:text-white'
                        }`}
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setError(null); }}
                        className={`flex-1 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            mode === 'login'
                                ? 'bg-primary text-black shadow-lg'
                                : 'text-on-surface-variant hover:text-white'
                        }`}
                    >
                        Log In
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs sm:text-sm font-medium mb-6 flex items-center gap-2 animate-in fade-in">
                        <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 tracking-wider uppercase">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">
                                    badge
                                </span>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Harsh Bhati"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 tracking-wider uppercase">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">
                                mail
                            </span>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 tracking-wider uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">
                                lock
                            </span>
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-on-surface-variant hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 tracking-wider uppercase">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">
                                    lock_reset
                                </span>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-3">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-primary text-black py-4 flex items-center justify-center gap-2 rounded-xl font-sans font-bold uppercase tracking-wider hover:bg-primary-container transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95"
                        >
                            {isSubmitting ? (
                                <Loader size="sm" />
                            ) : mode === 'signup' ? (
                                <>
                                    <span className="material-symbols-outlined text-xl">how_to_reg</span>
                                    Create Free Account & Unlock
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-xl">login</span>
                                    Log In & Resume Progress
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Micro Perks Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs text-on-surface-variant">
                    <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-base">verified</span>
                        <span>100% Free Access</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-base">sync</span>
                        <span>Cross-Device Sync</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-base">school</span>
                        <span>Certificate Support</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
