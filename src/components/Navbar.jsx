import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, userProfile, logout } = useUserAuth();

    const navLinkClasses = ({ isActive }) =>
        `font-sans text-sm tracking-wide transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`;

    return (
        <header className="fixed top-4 w-full z-50 transition-all duration-300 px-margin-mobile md:px-gutter">
            <div className="floral-glass rounded-full flex justify-between items-center px-6 md:px-8 py-3 max-w-container-max mx-auto shadow-lg">
                <Link to="/" className="flex items-center gap-3 transition-transform duration-200">
                    <span className="font-display text-xl md:text-2xl font-bold text-on-surface tracking-tight">HarshBahti</span>
                </Link>
                
                <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center">
                    <NavLink to="/" end className={navLinkClasses}>Training</NavLink>
                    <NavLink to="/benefits" className={navLinkClasses}>Benefits</NavLink>
                    <NavLink to="/certificates" className={navLinkClasses}>Certificates</NavLink>
                    <NavLink to="/about" className={navLinkClasses}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
                </nav>
                
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-white">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="truncate max-w-[120px]">{userProfile?.name || 'Member'}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-on-surface-variant hover:text-red-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                title="Sign out"
                            >
                                <span className="material-symbols-outlined text-sm">logout</span>
                                Exit
                            </button>
                        </div>
                    ) : (
                        <a
                            href="/#auth-gate"
                            className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-sans font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                        >
                            Sign In / Free Access
                        </a>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-on-surface p-2 flex items-center justify-center"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#09090B]/95 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-200 mt-4 rounded-3xl overflow-hidden mx-margin-mobile relative z-50">
                    <nav className="flex flex-col px-6 py-6 space-y-4">
                        {isAuthenticated && (
                            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                        {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-bold">{userProfile?.name}</div>
                                        <div className="text-on-surface-variant text-xs truncate">{userProfile?.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="text-red-400 text-xs font-semibold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-xl"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    Log Out
                                </button>
                            </div>
                        )}
                        <NavLink to="/" end className={({ isActive }) => `font-sans py-2 text-lg ${isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Training</NavLink>
                        <NavLink to="/benefits" className={({ isActive }) => `font-sans py-2 text-lg ${isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Benefits</NavLink>
                        <NavLink to="/certificates" className={({ isActive }) => `font-sans py-2 text-lg ${isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Certificates</NavLink>
                        <NavLink to="/about" className={({ isActive }) => `font-sans py-2 text-lg ${isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `font-sans py-2 text-lg ${isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
                        
                        {!isAuthenticated && (
                            <a
                                href="/#auth-gate"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black text-center font-sans px-6 py-4 rounded-full mt-6 w-full font-semibold transition-all"
                            >
                                Sign In / Free Access
                            </a>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
