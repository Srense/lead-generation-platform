import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
    return (
        <div className="bg-transparent min-h-screen text-on-surface font-body-base pt-32 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-margin-mobile md:px-gutter pb-24">
                <h1 className="font-display-lg text-display-lg text-primary mb-8 animate-in slide-in-from-bottom-4">Terms of Service</h1>
                <div className="glass-card rounded-2xl p-8 md:p-12 text-on-surface-variant space-y-6 animate-in slide-in-from-bottom-8">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <h2 className="text-xl font-bold text-slate-light mt-6">1. Acceptance of Terms</h2>
                    <p>By accessing or using the HarshBahti platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">2. Description of Service</h2>
                    <p>HarshBahti provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, personalized content, and branded programming through its network of properties which may be accessed through any various medium or device now known or hereafter developed.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">3. User Conduct</h2>
                    <p>You agree to use the Service only for lawful purposes. You are strictly prohibited from utilizing the Service to solicit the performance of any illegal activity or other activity which infringes our rights or the rights of others.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">4. Modifications to Service</h2>
                    <p>HarshBahti reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">5. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
