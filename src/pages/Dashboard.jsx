import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '../lib/submitLead';

export default function Dashboard() {
    const [minutes, setMinutes] = useState(14);
    const [seconds, setSeconds] = useState(59);

    const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const saved = await submitLead({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            inquiry_type: 'sales'
        });
        setIsSubmitting(false);
        if (saved) {
            navigate('/success');
        } else {
            alert('Error saving details, please try again.');
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
        <div className="bg-background text-on-surface font-body-base antialiased selection:bg-primary-container selection:text-on-primary-container pt-20">
            <Navbar />
            <main>
                <section className="relative pt-section-gap-mobile md:pt-section-gap pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto text-center">
                    <h1 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-slate-text mb-6">
                        Unlock the Power of the Internet
                    </h1>
                    <p className="font-body-base text-body-base text-on-surface-variant max-w-3xl mx-auto mb-10">
                        In just 15 minutes, you'll discover how ordinary people are using the internet to create new opportunities and build a better future.
                    </p>
                    <a className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-label-caps font-bold hover:scale-105 transition-transform duration-300 ambient-shadow" href="#training">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                        Watch Free Training
                    </a>
                </section>

                <section className="py-20 px-margin-mobile md:px-gutter max-w-container-max mx-auto" id="training">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-card ambient-shadow flex items-center justify-center group cursor-pointer">
                        <div className="absolute inset-0 z-0">
                            <img className="w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ" />
                        </div>
                        <div className="relative z-10 bg-primary/20 p-6 rounded-full border border-primary/50 backdrop-blur-md group-hover:bg-primary/40 group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(107,216,203,0.3)]">
                            <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-margin-mobile md:px-gutter bg-surface-container-low border-y border-glass-border" id="contact">
                    <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-headline-lg-mobile md:font-headline-lg text-slate-text mb-6">Ready to Take the Next Step?</h2>
                            <p className="font-body-base text-on-surface-variant mb-8">If this training gave you a new perspective, fill out the form below. Our team will review your details and guide you through.</p>
                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                <p className="font-body-base text-on-surface mb-4">
                                    🎁 This training is completely FREE for a limited time. Previously ₹299, but today you can access it at absolutely no cost.
                                </p>
                                <div className="flex items-center gap-4 text-primary font-display-xl-mobile font-bold">
                                    <div><span id="mins">{minutes.toString().padStart(2, '0')}</span><span className="text-sm font-normal ml-1">m</span></div>
                                    <span className="opacity-50">:</span>
                                    <div><span id="secs">{seconds.toString().padStart(2, '0')}</span><span className="text-sm font-normal ml-1">s</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-xl p-8 ambient-shadow relative">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Full Name</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-on-surface-variant material-symbols-outlined">person</span>
                                        <input required name="name" onChange={handleChange} className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:outline-none transition-colors" placeholder="John Doe" type="text" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Mobile Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-on-surface-variant material-symbols-outlined">phone_iphone</span>
                                        <input required name="phone" onChange={handleChange} className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:outline-none transition-colors" placeholder="+91 98765 43210" type="tel" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Email Address</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-on-surface-variant material-symbols-outlined">mail</span>
                                        <input required name="email" onChange={handleChange} className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:outline-none transition-colors" placeholder="john@example.com" type="email" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-label-caps text-on-surface-variant mb-1">City</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-on-surface-variant material-symbols-outlined">location_city</span>
                                        <input required name="city" onChange={handleChange} className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:outline-none transition-colors" placeholder="Mumbai" type="text" />
                                    </div>
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold mt-4 hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50" type="submit">
                                    {isSubmitting ? 'Securing Spot...' : 'Get Free Access Now'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
