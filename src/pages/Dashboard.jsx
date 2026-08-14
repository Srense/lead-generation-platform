import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
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
    const navigate = useNavigate();

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
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface mb-6 tracking-tight leading-tight max-w-5xl mx-auto">
                        HarshBahti: Curated Digital Craftsmanship.
                    </h1>
                    <p className="font-sans text-lg text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
                        A delicate approach to branding, design, and digital experiences. In just 15 minutes, discover a refined path to creating new opportunities on the internet.
                    </p>
                    <a className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-sans text-sm tracking-wide font-medium hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 ambient-shadow hover:-translate-y-1" href="#training">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                        Explore Our Work
                    </a>
                </section>

                <section className="py-20 px-margin-mobile md:px-gutter max-w-5xl mx-auto" id="training">
                    <div className="relative w-full rounded-2xl overflow-hidden floral-glass ambient-shadow flex items-center justify-center border border-white/50 p-2">
                        <div className="w-full rounded-xl overflow-hidden relative">
                            {videoAsset ? (
                                <video key={videoAsset} src={videoAsset} controls autoPlay muted playsInline preload="auto" crossOrigin="anonymous" className="w-full max-h-[70vh] object-cover" poster="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ" />
                            ) : (
                                <div className="relative w-full aspect-video flex items-center justify-center group cursor-pointer bg-surface-variant/30">
                                    <div className="absolute inset-0 z-0">
                                        <img className="w-full h-full object-cover opacity-80 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ" />
                                    </div>
                                    <div className="relative z-10 bg-white/40 p-6 rounded-full backdrop-blur-md group-hover:bg-white/60 group-hover:scale-110 transition-all shadow-lg text-primary">
                                        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-24 px-margin-mobile md:px-gutter relative" id="contact">
                    <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-16 items-start">
                        <div className="md:sticky md:top-32">
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-6">Let’s Create Together.</h2>
                            <p className="font-sans text-lg text-on-surface-variant mb-8 leading-relaxed max-w-md">If this training resonated with your vision, fill out the form. We'd love to explore how we can elevate your digital presence.</p>
                            
                            {isUrgentVisible && (
                                <div className="floral-glass rounded-xl p-6 mb-8 relative overflow-hidden border-l-4 border-l-primary">
                                    <p className="font-sans text-on-surface mb-4">
                                        {bannerText}
                                    </p>
                                    <div className="flex items-center gap-4 text-primary font-display text-3xl">
                                        <div><span id="mins">{minutes.toString().padStart(2, '0')}</span><span className="text-sm font-sans ml-1">m</span></div>
                                        <span className="opacity-50">:</span>
                                        <div><span id="secs">{seconds.toString().padStart(2, '0')}</span><span className="text-sm font-sans ml-1">s</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="floral-glass-heavy rounded-2xl p-8 ambient-shadow relative">
                            {submitStatus === 'duplicate' && (
                                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm mb-6 animate-in slide-in-from-top-2">
                                    We already have your details! Please check your inbox.
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm mb-6 animate-in slide-in-from-top-2">
                                    Oops! Something went wrong. Please try again.
                                </div>
                            )}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-sans font-medium text-on-surface-variant mb-1.5 ml-1">Full Name</label>
                                        <div className="relative">
                                            <input required name="name" onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Jane Doe" type="text" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-sans font-medium text-on-surface-variant mb-1.5 ml-1">Mobile</label>
                                        <div className="relative">
                                            <input required name="phone" onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="+91 98765 43210" type="tel" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-sans font-medium text-on-surface-variant mb-1.5 ml-1">Email Address</label>
                                    <div className="relative">
                                        <input required name="email" onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="jane@example.com" type="email" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-sans font-medium text-on-surface-variant mb-1.5 ml-1">City</label>
                                    <div className="relative">
                                        <input required name="city" onChange={handleChange} className="w-full bg-secondary-container/20 border border-secondary-container/50 rounded-xl py-3.5 px-4 text-on-surface text-sm focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all" placeholder="Your City" type="text" />
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <button disabled={isSubmitting} className="w-full bg-primary text-white py-4 flex items-center justify-center gap-2 rounded-xl font-sans font-medium hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" type="submit">
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
