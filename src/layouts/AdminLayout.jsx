import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const { isAuthenticated, isLoading, logout } = useAdmin();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isLoading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-primary">Loading secure workspace...</div>;
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

    const isCurrent = (path) => location.pathname === path;

    const navItemClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label-caps text-sm transition-colors ${isCurrent(path) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-on-surface-variant hover:bg-surface-container hover:text-slate-light'}`;

    return (
        <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row antialiased">
            {/* Sidebar Navigation */}
            <aside className={`w-64 bg-surface-container-lowest border-r border-glass-border flex-shrink-0 flex-col h-screen sticky top-0 z-50 transition-transform duration-300 md:flex ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl' : 'hidden'}`}>
                <div className="p-6 border-b border-glass-border flex items-center justify-between">
                    <div className="font-bold text-xl text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">security</span>
                        HQ Secure
                    </div>
                    <button className="md:hidden text-on-surface-variant" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="p-4 flex flex-col gap-2 flex-grow overflow-y-auto">
                    <div className="text-xs font-label-caps text-on-surface-variant/50 px-4 mb-2 mt-4">Database</div>
                    <Link to="/admin/leads" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/leads')}>
                        <span className="material-symbols-outlined text-lg">group</span>
                        Lead Responses
                    </Link>
                    <Link to="/admin/contacts" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/contacts')}>
                        <span className="material-symbols-outlined text-lg">contact_support</span>
                        Contact Inquiries
                    </Link>
                    <div className="text-xs font-label-caps text-on-surface-variant/50 px-4 mb-2 mt-6">Configuration</div>
                    <Link to="/admin/video" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/video')}>
                        <span className="material-symbols-outlined text-lg">videocam</span>
                        Video Manager
                    </Link>
                    <Link to="/admin/urgency" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass('/admin/urgency')}>
                        <span className="material-symbols-outlined text-lg">notifications_active</span>
                        Urgency Engine
                    </Link>
                </nav>
                <div className="p-4 border-t border-glass-border">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-label-caps text-sm">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay Background (dims the screen behind sidebar) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Main Secure Content Area */}
            <main className="flex-grow flex flex-col h-screen overflow-hidden relative">
                <header className="bg-surface/80 backdrop-blur-md border-b border-glass-border p-4 flex items-center gap-4 md:hidden sticky top-0 z-30 flex-shrink-0">
                    <button className="text-primary hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-primary flex-grow text-center">HQ Secure</span>
                    <button onClick={logout} className="text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-[#0F172A] relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
