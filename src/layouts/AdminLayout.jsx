import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

export default function AdminLayout() {
    const { isAuthenticated, isLoading, logout } = useAdmin();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center relative z-50"><Loader size="lg" text="SECURING HQ..." /></div>;
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

    const isCurrent = (path) => location.pathname === path;

    const navItemClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-all duration-300 ${isCurrent(path) ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'}`;

    return (
        <div className="min-h-screen bg-transparent text-on-surface flex flex-col md:flex-row antialiased font-sans">
            <aside className={`w-64 floral-glass border-r border-outline-variant/60 flex-shrink-0 flex-col h-screen sticky top-0 z-50 transition-transform duration-300 md:flex ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl' : 'hidden'}`}>
                <div className="p-6 border-b border-outline-variant/60 flex items-center justify-between">
                    <div className="font-display font-bold text-xl text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">shield_person</span>
                        HQ Secure
                    </div>
                    <button className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="p-4 flex flex-col gap-2 flex-grow overflow-y-auto">
                    <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 px-4 mb-2 mt-4">Database</div>
                    <Link to="/admin/leads" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/leads')}>
                        <span className="material-symbols-outlined text-lg">group</span>
                        Lead Responses
                    </Link>
                    <Link to="/admin/contacts" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/contacts')}>
                        <span className="material-symbols-outlined text-lg">contact_support</span>
                        Contact Inquiries
                    </Link>
                    <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 px-4 mb-2 mt-6">Configuration</div>
                    <Link to="/admin/video" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/video')}>
                        <span className="material-symbols-outlined text-lg">videocam</span>
                        Video Manager
                    </Link>
                    <Link to="/admin/urgency" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/urgency')}>
                        <span className="material-symbols-outlined text-lg">notifications_active</span>
                        Urgency Engine
                    </Link>
                </nav>
                <div className="p-4 border-t border-outline-variant/60">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 hover:text-error rounded-xl transition-colors font-sans font-medium text-sm">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Terminate Session
                    </button>
                </div>
            </aside>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <main className="flex-grow flex flex-col h-screen overflow-hidden relative">
                <header className="bg-white/60 backdrop-blur-md border-b border-outline-variant/60 p-4 flex items-center gap-4 md:hidden sticky top-0 z-30 flex-shrink-0 shadow-sm">
                    <button className="text-primary hover:text-primary/80 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-display font-bold text-primary flex-grow text-center text-lg">HQ Secure</span>
                    <button onClick={logout} className="text-error p-2 hover:bg-error/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-transparent relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
