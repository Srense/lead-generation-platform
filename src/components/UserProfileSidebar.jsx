import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import Loader from './Loader';

export default function UserProfileSidebar({ isOpen, onClose }) {
    const { userProfile, updatePassword, logout } = useUserAuth();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    if (!isOpen) return null;

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setStatus(null);

        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match. Please verify.' });
            return;
        }

        setIsSubmitting(true);
        const res = await updatePassword(newPassword);
        setIsSubmitting(false);

        if (res.success) {
            setStatus({ type: 'success', message: 'Password updated successfully! Use your new password next time you log in.' });
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setStatus({ type: 'error', message: res.error || 'Failed to update password. Please try again.' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />

            {/* Sidebar Drawer */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#09090B] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative z-10 overflow-y-auto">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                    {/* Top Content */}
                    <div>
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">manage_accounts</span>
                                <h3 className="font-display font-bold text-white text-lg">Account Settings</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface-variant hover:text-white flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        {/* User Identity Card */}
                        <div className="floral-glass rounded-2xl p-5 border border-white/10 mb-8 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 text-black flex items-center justify-center font-display font-bold text-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-display font-bold text-white text-base truncate">
                                        {userProfile?.name || 'Member'}
                                    </h4>
                                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        verified
                                    </span>
                                </div>
                                <p className="text-on-surface-variant text-xs truncate mb-2 font-mono">
                                    {userProfile?.email}
                                </p>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Lifetime Learner
                                </div>
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-base">password</span>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                                    Change Password
                                </h4>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Update your account password to securely log in across multiple devices.
                            </p>

                            {/* Status Alert Banner */}
                            {status && (
                                <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in ${
                                    status.type === 'success'
                                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                                }`}>
                                    <span className="material-symbols-outlined text-base flex-shrink-0">
                                        {status.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 tracking-wider uppercase">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-on-surface text-xs focus:border-primary focus:bg-black/80 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-on-surface-variant hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 tracking-wider uppercase">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm matching password"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-on-surface text-xs focus:border-primary focus:bg-black/80 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-primary text-black py-3.5 flex items-center justify-center gap-2 rounded-xl font-sans font-bold uppercase tracking-wider text-xs hover:bg-primary-container transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 mt-2"
                                >
                                    {isSubmitting ? <Loader size="sm" /> : 'Save New Password'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-8 border-t border-white/10 mt-8 space-y-3">
                        <button
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl font-sans font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">logout</span>
                            Log Out from Account
                        </button>

                        <p className="text-center text-[11px] text-on-surface-variant/60 font-sans">
                            HarshBahti Curated Digital Craftsmanship Platform
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
