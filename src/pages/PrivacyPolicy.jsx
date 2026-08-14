import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="bg-transparent min-h-screen text-on-surface font-sans pt-32 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-margin-mobile md:px-gutter pb-24">
                <h1 className="font-display text-4xl md:text-5xl text-primary mb-10 font-bold">Privacy Policy</h1>
                <div className="floral-glass rounded-3xl p-10 md:p-14 text-on-surface-variant space-y-8 ambient-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
                    <p className="font-sans text-sm relative z-10">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">1. Information We Collect</h2>
                        <p className="font-sans leading-relaxed">We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, financial and credit card information, and other information you choose to provide.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">2. How We Use Your Information</h2>
                        <p className="font-sans leading-relaxed">We may use the information we collect about you to: Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, develop safety features, authenticate users, and send product updates and administrative messages.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">3. Sharing of Information</h2>
                        <p className="font-sans leading-relaxed">We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: With third party service providers; in response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">4. Contact Us</h2>
                        <p className="font-sans leading-relaxed">If you have any questions about this Privacy Statement, please contact us at <a href="mailto:harshbahti90@gmail.com" className="text-primary hover:underline">harshbahti90@gmail.com</a>.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
