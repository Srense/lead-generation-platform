import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClasses = ({ isActive }) =>
        `font-label-caps text-label-caps transition-colors hover:scale-105 duration-200 active:scale-95 ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
        }`;

    return (
        <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl fixed top-0 w-full border-b border-glass-border shadow-sm z-50 transition-all duration-300">
            <div className="flex justify-between items-center px-margin-mobile md:px-gutter py-4 max-w-container-max mx-auto">
                import {useState} from 'react';
                import {NavLink, Link} from 'react-router-dom';

                export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

                const navLinkClasses = ({isActive}) =>
                `font-label-caps text-label-caps transition-colors hover:scale-105 duration-200 active:scale-95 ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
                }`;

                return (
                <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl fixed top-0 w-full border-b border-glass-border shadow-sm z-50 transition-all duration-300">
                    <div className="flex justify-between items-center px-margin-mobile md:px-gutter py-4 max-w-container-max mx-auto">
                        <Link to="/" className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary hover:scale-105 transition-transform duration-200 active:scale-95">HarshBahti</Link>
                        <nav className="hidden md:flex space-x-8 items-center">
                            <NavLink to="/" end className={navLinkClasses}>Training</NavLink>
                            <NavLink to="/benefits" className={navLinkClasses}>Benefits</NavLink>
                            <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
                        </nav>
                        <a href="/#training" className="bg-primary text-[#0F172A] font-label-caps text-label-caps px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 hidden md:block">Watch Now</a>
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-primary p-2 flex items-center justify-center"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-surface-container border-b border-glass-border shadow-lg animate-in slide-in-from-top-4 duration-200">
                            <nav className="flex flex-col px-margin-mobile py-6 space-y-4">
                                <NavLink to="/" end className={({ isActive }) => `text-label-caps font-label-caps py-2 text-lg ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Training</NavLink>
                                <NavLink to="/benefits" className={({ isActive }) => `text-label-caps font-label-caps py-2 text-lg ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Benefits</NavLink>
                                <NavLink to="/contact" className={({ isActive }) => `text-label-caps font-label-caps py-2 text-lg ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
                                <a href="/#training" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary hover:text-[#0F172A] text-[#0F172A] text-center font-label-caps text-label-caps px-6 py-4 rounded-full mt-6 w-full font-bold">Watch Now</a>
                            </nav>
                        </div>
                    )}
                </header>
                );
}
