import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="antialiased min-h-screen flex flex-col bg-transparent text-on-background font-sans">
            <Navbar />
            <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                <div className="mb-16 md:mb-24 text-center max-w-4xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 font-bold tracking-tight">About HarshBahti & The 15-Minute Internet Mastery Training</h1>
                    <p className="font-sans text-lg text-on-surface-variant mx-auto leading-relaxed max-w-3xl">
                        Welcome to the official hub of HarshBahti. This platform is designed to provide actionable digital skill training for students, creators, and aspiring professionals looking to leverage the modern internet. Based near Chandigarh University, this training program breaks down complex digital marketing strategies, online visibility systems, and web optimization into simple, manageable steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                    <div className="floral-glass rounded-3xl p-10 md:p-12 ambient-shadow h-full flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700"></div>
                        <h2 className="font-display text-3xl text-on-surface mb-8 border-b border-outline-variant/50 pb-6 relative z-10">What You Will Learn:</h2>
                        <ul className="space-y-10 flex-grow relative z-10">
                            <li className="flex gap-6 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                </div>
                                <div>
                                    <h3 className="font-sans font-semibold text-lg text-on-surface mb-2">Internet Systems Optimization</h3>
                                    <p className="font-sans text-on-surface-variant leading-relaxed">Learn how the modern web handles traffic and how to position your ideas effectively online.</p>
                                </div>
                            </li>
                            <li className="flex gap-6 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover/item:bg-secondary group-hover/item:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined">design_services</span>
                                </div>
                                <div>
                                    <h3 className="font-sans font-semibold text-lg text-on-surface mb-2">Digital Asset Creation</h3>
                                    <p className="font-sans text-on-surface-variant leading-relaxed">Discover the exact frameworks used to build high-converting landing assets and structured online workflows.</p>
                                </div>
                            </li>
                            <li className="flex gap-6 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover/item:bg-tertiary group-hover/item:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined">diversity_3</span>
                                </div>
                                <div>
                                    <h3 className="font-sans font-semibold text-lg text-on-surface mb-2">Audience Engagement</h3>
                                    <p className="font-sans text-on-surface-variant leading-relaxed">Master the core principles of online positioning to build trust and authority in any niche.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="floral-glass-heavy rounded-3xl p-10 md:p-12 ambient-shadow h-full flex flex-col relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full group-hover:bg-secondary/10 transition-colors duration-700"></div>
                        <h2 className="font-display text-3xl text-on-surface mb-8 border-b border-outline-variant/50 pb-6 relative z-10">Connect & Verify</h2>
                        <p className="font-sans text-lg text-on-surface-variant mb-12 flex-grow leading-relaxed relative z-10">
                            This platform is managed directly by <strong>HarshBahti</strong>. For updates, professional collaborations, or networking, connect via the official LinkedIn Profile. For direct training inquiries or support, reach out via our verified channel.
                        </p>
                        <div className="flex flex-col gap-4 mt-auto relative z-10">
                            <a href="https://www.linkedin.com/in/harsh-bahti-0333583aa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 text-on-surface hover:bg-surface-variant/50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-outline-variant group/link">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-outline-variant flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">language</span>
                                </div>
                                <span className="font-sans font-medium text-lg">HarshBahti LinkedIn Profile</span>
                            </a>
                            <a href="mailto:harshbahti90@gmail.com" className="flex items-center gap-5 text-on-surface hover:bg-surface-variant/50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-outline-variant group/link">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-outline-variant flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <span className="font-sans font-medium text-lg">harshbahti90@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
