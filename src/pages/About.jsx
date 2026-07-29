import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="antialiased min-h-screen flex flex-col bg-transparent text-on-background">
            <Navbar />
            <main className="flex-grow pt-32 pb-section-gap-mobile md:pb-section-gap px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-slate-light mb-6">About Harsh Bahti & The 15-Minute Internet Mastery Training</h1>
                    <p className="font-body-base text-body-base text-on-surface-variant mx-auto text-left md:text-center">
                        Welcome to the official hub of Harsh Bahti. This platform is designed to provide actionable digital skill training for students, creators, and aspiring professionals looking to leverage the modern internet. Based near Chandigarh University, this training program breaks down complex digital marketing strategies, online visibility systems, and web optimization into simple, manageable steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16 items-stretch">
                    <div className="glass-card rounded-xl p-8 md:p-10 ambient-shadow h-full flex flex-col">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-light mb-8 border-b border-glass-border pb-4">What You Will Learn in This Digital Training:</h2>
                        <ul className="space-y-8 flex-grow">
                            <li className="flex flex-col gap-2">
                                <h3 className="font-label-caps text-label-caps font-bold text-primary flex items-center gap-2"><span className="material-symbols-outlined text-sm">rocket_launch</span> Internet Systems Optimization</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant pl-6 lg:pl-8">Learn how the modern web handles traffic and how to position your ideas effectively online.</p>
                            </li>
                            <li className="flex flex-col gap-2">
                                <h3 className="font-label-caps text-label-caps font-bold text-primary flex items-center gap-2"><span className="material-symbols-outlined text-sm">design_services</span> Digital Asset Creation</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant pl-6 lg:pl-8">Discover the exact frameworks used to build high-converting landing assets and structured online workflows.</p>
                            </li>
                            <li className="flex flex-col gap-2">
                                <h3 className="font-label-caps text-label-caps font-bold text-primary flex items-center gap-2"><span className="material-symbols-outlined text-sm">diversity_3</span> Audience Engagement</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant pl-6 lg:pl-8">Master the core principles of online positioning to build trust and authority in any niche.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="glass-card rounded-xl p-8 md:p-10 ambient-shadow h-full flex flex-col">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-light mb-8 border-b border-glass-border pb-4">Connect & Verify</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-8 flex-grow text-lg leading-relaxed">
                            This platform is managed directly by <strong>Harsh Bahti</strong>. For updates, professional collaborations, or networking, connect via the official Harsh Bahti LinkedIn Profile. For direct training inquiries or support, reach out via our verified channel at harshbahti90@gmail.com.
                        </p>
                        <div className="flex flex-col gap-4 mt-auto">
                            <a href="https://linkedin.com/in/harsh-bahti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-primary hover:bg-glass-border p-3 rounded-xl transition-colors group">
                                <span className="material-symbols-outlined bg-[#0F172A] w-12 h-12 rounded-lg flex items-center justify-center border border-glass-border group-hover:border-primary transition-colors text-2xl">language</span>
                                <span className="font-label-caps text-label-caps font-bold">Harsh Bahti LinkedIn Profile</span>
                            </a>
                            <a href="mailto:harshbahti90@gmail.com" className="flex items-center gap-4 text-primary hover:bg-glass-border p-3 rounded-xl transition-colors group">
                                <span className="material-symbols-outlined bg-[#0F172A] w-12 h-12 rounded-lg flex items-center justify-center border border-glass-border group-hover:border-primary transition-colors text-2xl">mail</span>
                                <span className="font-label-caps text-label-caps font-bold">harshbahti90@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
