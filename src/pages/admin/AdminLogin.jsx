import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { login } = useAdmin();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/admin/leads');
        } else {
            setError('Invalid credentials. Access Denied.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 relative">
            <div className="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none"></div>
            <div className="max-w-md w-full glass-card p-10 rounded-2xl ambient-shadow border border-glass-border relative z-10">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 border border-primary/20">
                        <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                    </div>
                    <h2 className="font-headline-lg-mobile text-slate-light text-2xl font-bold">Secure Access</h2>
                    <p className="text-on-surface-variant font-body-sm mt-2">Enter your secured credentials to continue</p>
                    <div className="bg-primary/10 border border-primary/20 rounded p-2 mt-4 text-xs font-label-caps text-primary">
                        ID: admin@harshbhati.com
                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block font-label-caps text-on-surface-variant text-xs mb-1">Email / Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-on-surface-variant material-symbols-outlined text-lg">person</span>
                            <input
                                type="text"
                                className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-label-caps text-on-surface-variant text-xs mb-1">Vault Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-on-surface-variant material-symbols-outlined text-lg">lock</span>
                            <input
                                type="password"
                                className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-[#0F172A] py-3 rounded-lg font-bold hover:scale-[1.02] transition-transform shadow-[0_4px_14px_0_rgba(107,216,203,0.2)]">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
