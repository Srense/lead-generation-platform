import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="bg-transparent min-h-screen text-on-surface font-body-base pt-32 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-margin-mobile md:px-gutter pb-24">
                <h1 className="font-display-lg text-display-lg text-primary mb-8 animate-in slide-in-from-bottom-4">Privacy Policy</h1>
                <div className="glass-card rounded-2xl p-8 md:p-12 text-on-surface-variant space-y-6 animate-in slide-in-from-bottom-8">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <h2 className="text-xl font-bold text-slate-light mt-6">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, financial and credit card information, and other information you choose to provide.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">2. How We Use Your Information</h2>
                    <p>We may use the information we collect about you to: Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, develop safety features, authenticate users, and send product updates and administrative messages.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">3. Sharing of Information</h2>
                    <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: With third party service providers; in response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Statement, please contact us at support@harshbahti.in.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
