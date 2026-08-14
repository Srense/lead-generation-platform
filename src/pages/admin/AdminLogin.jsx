import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import GlowCard from '../../components/GlowCard';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAdmin();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await login(username, password);
        setIsSubmitting(false);
        if (success) {
            navigate('/admin/leads');
        } else {
            setError('Invalid credentials. Access Denied.');
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-on-surface font-sans flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-secondary/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <GlowCard className="max-w-md w-full floral-glass-heavy p-10 md:p-12 rounded-3xl ambient-shadow relative z-10 border border-white/5">
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-primary/30 text-primary">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                    </div>
                    <h2 className="font-display text-3xl text-on-surface font-bold tracking-tight mb-2">Secure Access</h2>
                    <p className="text-on-surface-variant font-sans text-sm">Enter your credentials to continue</p>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-6 text-xs font-mono font-medium text-primary">
                        ID: admin@harshbhati.com
                    </div>
                </div>

                {error && <div className="bg-error/10 border border-error/20 text-error text-sm font-medium p-4 rounded-xl mb-8 flex items-center justify-center gap-2"><span className="material-symbols-outlined text-lg">error</span>{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block font-sans font-semibold tracking-wider uppercase text-on-surface-variant text-xs ml-1">Email / Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-on-surface-variant material-symbols-outlined text-lg">person</span>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block font-sans font-semibold tracking-wider uppercase text-on-surface-variant text-xs ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-on-surface-variant material-symbols-outlined text-lg">lock</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-on-surface-variant hover:text-white transition-colors focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full bg-primary text-black py-4 rounded-xl font-sans font-bold uppercase tracking-wider hover:bg-primary-container hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none flex justify-center mt-8">
                        {isSubmitting ? <Loader size="sm" /> : 'Authenticate'}
                    </button>
                </form>
            </GlowCard>
        </div>
    );
}
