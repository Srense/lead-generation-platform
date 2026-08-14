import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-surface-variant/50 border-t border-outline-variant py-12 mt-auto">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="font-display text-2xl font-bold text-on-surface tracking-tight mb-2">HarshBahti</span>
                        <p className="font-sans text-sm text-on-surface-variant text-center md:text-left max-w-xs">
                            A delicate approach to digital training, branding, and experiences.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex gap-6">
                            <Link to="/privacy-policy" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy</Link>
                            <Link to="/terms-of-service" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Terms</Link>
                            <Link to="/cookie-policy" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">Cookies</Link>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">camera</span>
                            </a>
                            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">video_library</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-sans text-xs text-on-surface-variant">&copy; {new Date().getFullYear()} HarshBahti. All rights reserved.</p>
                    <Link to="/admin/login" className="font-sans text-xs text-on-surface-variant opacity-50 hover:opacity-100 transition-opacity">Admin</Link>
                </div>
            </div>
        </footer>
    );
}
