import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
export default function Success() {
    return (
        <div className="bg-transparent text-on-background min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-gutter py-24 mt-20">
                <div className="max-w-3xl w-full floral-glass-heavy rounded-3xl p-10 md:p-16 text-center ambient-shadow flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full"></div>
                    
                    <div className="relative z-10 w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
                        <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h1 className="relative z-10 font-display text-4xl md:text-5xl text-on-surface mb-6 font-bold tracking-tight">Application Successful</h1>
                    <p className="relative z-10 font-sans text-lg text-on-surface-variant mb-12 max-w-2xl leading-relaxed">
                        Thank you for applying. Your request for exclusive access is currently being processed by our team. We review each application carefully to ensure the highest quality community.
                    </p>
                    
                    <div className="relative z-10 flex flex-col gap-6 w-full max-w-xl text-left mb-12 mx-auto">
                        <div className="bg-surface-variant/40 rounded-2xl p-8 border border-outline-variant/60 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </div>
                                <h3 className="font-sans font-semibold text-xl text-on-surface">Check Your Inbox</h3>
                            </div>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed pl-14">We've securely received your information. Please check your email inbox for the verified training link and next steps.</p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex w-full justify-center">
                        <Link to="/" className="bg-primary text-white font-sans font-medium py-4 px-12 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 transition-all duration-300">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
