import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
    return (
        <div className="bg-transparent min-h-screen text-on-surface font-sans pt-32 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-margin-mobile md:px-gutter pb-24">
                <h1 className="font-display text-4xl md:text-5xl text-primary mb-10 font-bold">Terms of Service</h1>
                <div className="floral-glass rounded-3xl p-10 md:p-14 text-on-surface-variant space-y-8 ambient-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
                    <p className="font-sans text-sm relative z-10">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">1. Acceptance of Terms</h2>
                        <p className="font-sans leading-relaxed">By accessing or using the HarshBahti platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">2. Description of Service</h2>
                        <p className="font-sans leading-relaxed">HarshBahti provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, personalized content, and branded programming through its network of properties which may be accessed through any various medium or device now known or hereafter developed.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">3. User Conduct</h2>
                        <p className="font-sans leading-relaxed">You agree to use the Service only for lawful purposes. You are strictly prohibited from utilizing the Service to solicit the performance of any illegal activity or other activity which infringes our rights or the rights of others.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">4. Modifications to Service</h2>
                        <p className="font-sans leading-relaxed">HarshBahti reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">5. Governing Law</h2>
                        <p className="font-sans leading-relaxed">These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
