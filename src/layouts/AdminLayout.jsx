import { useAdmin } from '../context/AdminContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const { isAuthenticated, isLoading, logout } = useAdmin();
    const location = useLocation();

    if (isLoading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-primary">Loading secure workspace...</div>;
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

    const isCurrent = (path) => location.pathname === path;

    const navItemClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label-caps text-sm transition-colors ${isCurrent(path) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-on-surface-variant hover:bg-surface-container hover:text-slate-light'}`;

    return (
        <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row antialiased">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-glass-border flex-shrink-0 flex flex-col hidden md:flex md:h-screen sticky top-0">
                <div className="p-6 border-b border-glass-border flex items-center justify-between">
                    <div className="font-bold text-xl text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">security</span>
                        HQ Secure
                    </div>
                </div>
                <nav className="p-4 flex flex-col gap-2 flex-grow overflow-y-auto">
                    <div className="text-xs font-label-caps text-on-surface-variant/50 px-4 mb-2 mt-4">Database</div>
                    <Link to="/admin/leads" className={navItemClass('/admin/leads')}>
                        <span className="material-symbols-outlined text-lg">group</span>
                        Lead Responses
                    </Link>
                    <div className="text-xs font-label-caps text-on-surface-variant/50 px-4 mb-2 mt-6">Configuration</div>
                    <Link to="/admin/video" className={navItemClass('/admin/video')}>
                        <span className="material-symbols-outlined text-lg">videocam</span>
                        Video Manager
                    </Link>
                    <Link to="/admin/urgency" className={navItemClass('/admin/urgency')}>
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

            {/* Main Secure Content Area */}
            <main className="flex-grow flex flex-col h-screen overflow-hidden">
                <header className="bg-surface/80 backdrop-blur-md border-b border-glass-border p-4 flex items-center gap-4 md:hidden sticky top-0 z-10 flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">security</span>
                    <span className="font-bold text-primary flex-grow">HQ Secure</span>
                    <button onClick={logout} className="text-red-400 p-2">
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
