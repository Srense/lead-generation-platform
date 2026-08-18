import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '../lib/submitLead';
import Loader from '../components/Loader';

export default function Dashboard() {
    const [minutes, setMinutes] = useState(14);
    const [seconds, setSeconds] = useState(59);
    const [bannerText, setBannerText] = useState('🎁 This training is completely FREE for a limited time. Previously ₹299, but today you can access it at absolutely no cost.');
    const [isUrgentVisible, setIsUrgentVisible] = useState(true);

    const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [videoAsset, setVideoAsset] = useState(null);
    const [showSkipWarning, setShowSkipWarning] = useState(false);

    const videoRef = useRef(null);
    const maxWatchedTimeRef = useRef(0);
    const navigate = useNavigate();

    // Anti-skip handlers
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        // If current time jumped ahead of max watched time by more than 1.5 seconds
        if (current > maxWatchedTimeRef.current + 1.5) {
            videoRef.current.currentTime = maxWatchedTimeRef.current;
            setShowSkipWarning(true);
        } else {
            maxWatchedTimeRef.current = Math.max(maxWatchedTimeRef.current, current);
        }
    };

    const handleSeeking = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        // If seeking ahead of max watched time
        if (current > maxWatchedTimeRef.current + 0.5) {
            videoRef.current.currentTime = maxWatchedTimeRef.current;
            setShowSkipWarning(true);
        }
    };

    const handleDismissWarning = () => {
        setShowSkipWarning(false);
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    useEffect(() => {
        const fetchRemoteAssets = async () => {
            const { supabase } = await import('../lib/supabase');
            if (!supabase) return;

            // Fetch video
            const { data: videoData } = await supabase.from('config').select('value').eq('key', 'video_url').single();
            if (videoData && videoData.value) setVideoAsset(videoData.value);

            // Fetch urgency
            const { data: urgencyData } = await supabase.from('config').select('value').eq('key', 'urgency_config').single();
            if (urgencyData && urgencyData.value) {
                try {
                    const parsed = JSON.parse(urgencyData.value);
                    setMinutes(parsed.minutes);
                    setSeconds(parsed.seconds);
                    setBannerText(parsed.text);
                    setIsUrgentVisible(parsed.visible);
                } catch (e) { }
            }
        };
        fetchRemoteAssets();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        const result = await submitLead({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city
        });
        setIsSubmitting(false);
        if (result.success) {
            navigate('/success');
        } else if (result.isDuplicate) {
            setSubmitStatus('duplicate');
        } else {
            setSubmitStatus('error');
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    setMinutes((m) => m - 1);
                    return 59;
                }
                return prevSeconds - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [minutes]);

    return (
        <div className="bg-transparent text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container pt-24">
            <Navbar />
            <main>
                <section className="relative pt-12 md:pt-24 pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto text-center">
                    <div className="floral-glass-heavy rounded-3xl p-12 md:p-20 ambient-shadow relative overflow-hidden">
                        
                        <h1 className="relative z-10 font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight max-w-5xl mx-auto text-gradient-shimmer">
                            HarshBahti: Curated Digital Craftsmanship.
                        </h1>
                        <p className="relative z-10 font-sans text-lg text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
                            A delicate approach to branding, design, and digital experiences. In just 15 minutes, discover a refined path to creating new opportunities on the internet.
                        </p>
                        <a className="relative z-10 inline-flex items-center gap-3 bg-primary/10 border border-primary text-primary px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase font-bold hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1" href="#training">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                            Explore Our Work
                        </a>
                    </div>
                </section>

                <section className="py-20 px-margin-mobile md:px-gutter max-w-6xl mx-auto" id="training">
                    <div className="relative w-full rounded-[2rem] overflow-hidden floral-glass ambient-shadow flex items-center justify-center p-3 border border-white/5">
                        <div className="w-full rounded-3xl overflow-hidden relative bg-transparent">
                            {videoAsset ? (
                                <video
                                    ref={videoRef}
                                    key={videoAsset}
                                    src={videoAsset}
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    preload="auto"
                                    crossOrigin="anonymous"
                                    onTimeUpdate={handleTimeUpdate}
                                    onSeeking={handleSeeking}
                                    onContextMenu={(e) => e.preventDefault()}
                                    controlsList="nodownload noplaybackrate"
                                    className="w-full h-auto aspect-video object-contain bg-transparent opacity-90"
                                    poster="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ"
                                />
                            ) : (
                                <div className="relative w-full aspect-video flex items-center justify-center group cursor-pointer bg-surface/50">
                                    <div className="absolute inset-0 z-0">
                                        <img className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ" />
                                    </div>
                                    <div className="relative z-10 bg-black/60 p-6 rounded-full backdrop-blur-xl group-hover:bg-primary group-hover:text-black group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-primary border border-white/10">
                                        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Anti-Skip Warning Modal */}
                {showSkipWarning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="floral-glass-heavy border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/30">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>
                            
                            <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
                                Skipping Video Is Not Allowed
                            </h3>
                            
                            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                                Skipping is not allowed. You have to watch the video completely to unlock the bootcamp.
                            </p>
                            
                            <button
                                onClick={handleDismissWarning}
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all transform active:scale-95"
                            >
                                Continue Watching
                            </button>
                        </div>
                    </div>
                )}

                <section className="py-24 px-margin-mobile md:px-gutter relative" id="contact">
                    <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-16 items-start">
                        <div className="md:sticky md:top-32">
                            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gradient-shimmer">Start Your Application</h2>
                            <p className="font-sans text-lg text-on-surface-variant mb-8 leading-relaxed max-w-md">Join the platform to access premium insights. Fill out the application and a specialist will contact you.</p>
                            
                            {isUrgentVisible && (
                                <div className="floral-glass rounded-xl p-6 mb-8 relative overflow-hidden border-l-4 border-l-primary flex items-center justify-between">
                                    <p className="font-sans text-sm text-on-surface-variant flex-1 pr-4">
                                        {bannerText}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-mono text-2xl bg-black/40 px-4 py-2 rounded-lg border border-primary/20">
                                        <div><span id="mins">{minutes.toString().padStart(2, '0')}</span><span className="text-xs font-sans text-primary/70 ml-1">M</span></div>
                                        <span className="opacity-50">:</span>
                                        <div><span id="secs">{seconds.toString().padStart(2, '0')}</span><span className="text-xs font-sans text-primary/70 ml-1">S</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="floral-glass-heavy rounded-3xl p-8 ambient-shadow relative">
                            {submitStatus === 'duplicate' && (
                                <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl text-sm mb-6 animate-in slide-in-from-top-2 flex gap-2 items-center">
                                    <span className="material-symbols-outlined">info</span> We already have your details! Please check your inbox.
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm mb-6 animate-in slide-in-from-top-2 flex gap-2 items-center">
                                    <span className="material-symbols-outlined">error</span> Oops! Something went wrong. Please try again.
                                </div>
                            )}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-2 tracking-wider uppercase">Full Name</label>
                                        <div className="relative">
                                            <input required name="name" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20" placeholder="Jane Doe" type="text" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-2 tracking-wider uppercase">Mobile</label>
                                        <div className="relative">
                                            <input required name="phone" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20" placeholder="+91 98765 43210" type="tel" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-2 tracking-wider uppercase">Email Address</label>
                                    <div className="relative">
                                        <input required name="email" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20" placeholder="jane@example.com" type="email" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-2 tracking-wider uppercase">City</label>
                                    <div className="relative">
                                        <input required name="city" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-secondary focus:bg-black/60 focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-white/20" placeholder="Your City" type="text" />
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <button disabled={isSubmitting} className="w-full bg-primary text-black py-4 flex items-center justify-center gap-2 rounded-xl font-sans font-bold uppercase tracking-wider hover:bg-primary-container transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]" type="submit">
                                        {isSubmitting ? <Loader size="sm" /> : 'Get Free Access Now'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
