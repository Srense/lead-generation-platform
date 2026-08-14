import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { submitLead } from '../lib/submitLead';

export default function ContactUs() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', inquiryType: 'support', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        const result = await submitLead({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            inquiry_type: formData.inquiryType,
            message: formData.message,
            city: 'Unknown',
            phone: 'Not Provided'
        });

        setIsSubmitting(false);
        if (result.success) {
            setSubmitStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', inquiryType: 'support', message: '' });
            setTimeout(() => setSubmitStatus(null), 5000);
        } else if (result.isDuplicate) {
            setSubmitStatus('duplicate');
        } else {
            setSubmitStatus('error');
        }
    };

    return (
        <div className="antialiased min-h-screen flex flex-col bg-transparent text-on-background font-sans">
            <Navbar />
            <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                <div className="mb-16 md:mb-24 text-center">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 font-bold tracking-tight">Get in Touch</h1>
                    <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Whether you're looking for support, have an inquiry, or want to discuss a potential partnership, our team is ready to assist you. Reach out today.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="md:col-span-5 grid grid-cols-1 gap-8">
                        <div className="floral-glass rounded-2xl p-8 md:p-10 ambient-shadow hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm">
                                <span className="material-symbols-outlined text-2xl">mail</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-3 font-semibold">Email Us</h3>
                            <p className="font-sans text-base text-on-surface-variant mb-6 leading-relaxed">For general inquiries and support, drop us an email anytime.</p>
                            <a className="inline-block text-primary font-sans font-semibold text-lg hover:text-primary-container transition-colors" href="mailto:harshbahti90@gmail.com">harshbahti90@gmail.com</a>
                        </div>
                        <div className="floral-glass rounded-2xl p-8 md:p-10 ambient-shadow hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-secondary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-secondary shadow-sm">
                                <span className="material-symbols-outlined text-2xl">location_on</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-3 font-semibold">Visit HQ</h3>
                            <p className="font-sans text-base text-on-surface-variant mb-6 leading-relaxed">If you're in the area, feel free to schedule a visit to our main office.</p>
                            <address className="text-on-surface font-sans text-base not-italic leading-loose">
                                Chandigarh<br />
                                Mohali
                            </address>
                        </div>
                    </div>
                    
                    <div className="md:col-span-7 floral-glass-heavy rounded-3xl p-8 md:p-12 ambient-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
                        <h2 className="font-display text-3xl text-on-surface mb-8 font-bold relative z-10">Send a Message</h2>
                        
                        <div className="relative z-10">
                            {submitStatus === 'success' && (
                                <div className="mb-8 p-5 rounded-xl border border-secondary/30 bg-secondary/10 text-secondary font-medium animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Message received successfully! We'll be in touch soon.
                                </div>
                            )}
                            {submitStatus === 'duplicate' && (
                                <div className="mb-8 p-5 rounded-xl border border-error/30 bg-error/10 text-error font-medium animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined">info</span>
                                    You have recently submitted an inquiry with this email. We'll reply shortly!
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="mb-8 p-5 rounded-xl border border-error/30 bg-error/10 text-error font-medium animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined">error</span>
                                    An unknown error occurred. Please try again.
                                </div>
                            )}
                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-sans font-medium text-sm text-on-surface-variant ml-1">First Name</label>
                                        <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-base focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Jane" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-sans font-medium text-sm text-on-surface-variant ml-1">Last Name</label>
                                        <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-base focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Doe" type="text" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-sans font-medium text-sm text-on-surface-variant ml-1">Email Address</label>
                                    <input required name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-base focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="jane.doe@example.com" type="email" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-sans font-medium text-sm text-on-surface-variant ml-1">Inquiry Type</label>
                                    <div className="relative">
                                        <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 pl-4 pr-10 text-on-surface text-base focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer">
                                            <option value="support">General Support</option>
                                            <option value="sales">Sales &amp; Partnerships</option>
                                            <option value="press">Press &amp; Media</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-3.5 text-on-surface-variant pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-sans font-medium text-sm text-on-surface-variant ml-1">Message</label>
                                    <textarea required name="message" value={formData.message} onChange={handleChange} className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 px-4 text-on-surface text-base focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none" placeholder="How can we help you today?" rows="5"></textarea>
                                </div>
                                <button disabled={isSubmitting} type="submit" className="mt-6 bg-primary text-white font-sans font-medium py-4 px-8 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
