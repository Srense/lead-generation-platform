import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { submitLead } from '../lib/submitLead';

export default function ContactUs() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', inquiryType: 'support', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const savedInfo = await submitLead({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            inquiry_type: formData.inquiryType,
            message: formData.message,
            city: 'Unknown',
            phone: 'Not Provided'
        });

        setIsSubmitting(false);
        if (savedInfo) {
            setSuccessMessage("Message received successfully! We'll be in touch soon.");
            setFormData({ firstName: '', lastName: '', email: '', inquiryType: 'support', message: '' });
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    return (
        <div className="antialiased min-h-screen flex flex-col bg-[#0F172A] text-on-background">
            <Navbar />
            <main className="flex-grow pt-32 pb-section-gap-mobile md:pb-section-gap px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                <div className="mb-16 md:mb-24 text-center">
                    <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-slate-light mb-6">Get in Touch</h1>
                    <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">Whether you're looking for support, have an inquiry, or want to discuss a potential partnership, our team is ready to assist you. Reach out today.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="md:col-span-5 grid grid-cols-1 gap-6">
                        <div className="glass-card rounded-xl p-8 ambient-shadow hover:scale-105 transition-transform duration-300">
                            <div className="bg-[#0F172A] w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-glass-border">
                                <span className="material-symbols-outlined text-primary">mail</span>
                            </div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-slate-light mb-2">Email Us</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">For general inquiries and support, drop us an email anytime.</p>
                            <a className="text-primary font-label-caps text-label-caps hover:underline" href="mailto:support@harshswati.com">support@harshswati.com</a>
                        </div>
                        <div className="glass-card rounded-xl p-8 ambient-shadow hover:scale-105 transition-transform duration-300">
                            <div className="bg-[#0F172A] w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-glass-border">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                            </div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-slate-light mb-2">Visit HQ</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">If you're in the area, feel free to schedule a visit to our main office.</p>
                            <address className="text-slate-light font-body-sm text-body-sm not-italic">
                                123 Digital Avenue<br />
                                Tech District, Suite 400<br />
                                San Francisco, CA 94105
                            </address>
                        </div>
                    </div>
                    <div className="md:col-span-7 glass-card rounded-xl p-8 md:p-12 ambient-shadow">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-light mb-8">Send a Message</h2>
                        {successMessage && <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 mb-6 rounded-lg text-sm text-center font-bold">{successMessage}</div>}
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant">First Name</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="bg-[#0F172A] border border-slate-light/20 rounded-lg px-4 py-3 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-shadow text-sm" placeholder="Jane" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant">Last Name</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleChange} className="bg-[#0F172A] border border-slate-light/20 rounded-lg px-4 py-3 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-shadow text-sm" placeholder="Doe" type="text" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-label-caps text-label-caps text-on-surface-variant">Email Address</label>
                                <input required name="email" value={formData.email} onChange={handleChange} className="bg-[#0F172A] border border-slate-light/20 rounded-lg px-4 py-3 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-shadow text-sm" placeholder="jane.doe@example.com" type="email" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-label-caps text-label-caps text-on-surface-variant">Inquiry Type</label>
                                <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="bg-[#0F172A] border border-slate-light/20 rounded-lg px-4 py-3 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-shadow text-sm appearance-none">
                                    <option value="support">General Support</option>
                                    <option value="sales">Sales &amp; Partnerships</option>
                                    <option value="press">Press &amp; Media</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-label-caps text-label-caps text-on-surface-variant">Message</label>
                                <textarea required name="message" value={formData.message} onChange={handleChange} className="bg-[#0F172A] border border-slate-light/20 rounded-lg px-4 py-3 text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-shadow text-sm resize-none" placeholder="How can we help you today?" rows="5"></textarea>
                            </div>
                            <button disabled={isSubmitting} type="submit" className="mt-4 bg-primary text-[#0F172A] font-bold py-4 px-8 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_4px_14px_0_rgba(107,216,203,0.39)] disabled:opacity-50">
                                {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
