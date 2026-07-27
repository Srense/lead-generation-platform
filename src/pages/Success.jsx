import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
export default function Success() {
    return (
        <div className="bg-transparent text-on-background min-h-screen flex flex-col font-body-base">
            {/* TopNavBar */}
            <Navbar />
            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-gutter py-section-gap-mobile md:py-section-gap mt-20">
                <div className="max-w-3xl w-full glass-card rounded-xl p-8 md:p-12 text-center ambient-shadow flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h1 className="font-display-xl-mobile md:font-display-xl text-on-surface mb-4">Application Successful</h1>
                    <p className="font-body-base text-body-base text-on-surface-variant mb-10 max-w-2xl">
                        Thank you for applying. Your request for exclusive access is currently being processed by our team. We review each application carefully to ensure the highest quality community.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl text-left mb-10">
                        <div className="bg-surface-container rounded-lg p-6 border border-glass-border">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <h3 className="font-label-caps text-label-caps text-on-surface">Step 1: Check Your Email</h3>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">We've sent a confirmation email. Please allow up to 24 hours for final approval and onboarding instructions.</p>
                        </div>
                        <div className="bg-surface-container rounded-lg p-6 border border-glass-border">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-primary">forum</span>
                                <h3 className="font-label-caps text-label-caps text-on-surface">Step 2: Join Telegram</h3>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">While you wait, join our public Telegram channel for daily insights and community updates.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button className="bg-primary text-on-primary-container font-label-caps text-label-caps py-4 px-8 rounded-DEFAULT hover:scale-105 transition-transform duration-200">
                            Join Telegram Group
                        </button>
                        <button className="bg-transparent border border-primary text-primary font-label-caps text-label-caps py-4 px-8 rounded-DEFAULT hover:bg-primary/10 transition-colors duration-200">
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
}
