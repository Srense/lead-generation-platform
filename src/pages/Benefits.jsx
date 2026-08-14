import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlowCard from '../components/GlowCard';
import { Link } from 'react-router-dom';
export default function Benefits() {
    return (
        <div className="bg-transparent text-on-background min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                <section className="text-center mb-16 md:mb-24">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 font-bold tracking-tight text-gradient-shimmer">Elevating Brands through Thoughtful Design</h1>
                    <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Unlock your potential with skills designed for the modern internet. Discover the advantages of expert-led digital training with a delicate approach.</p>
                </section>
                
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <GlowCard className="floral-glass p-10 rounded-3xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border border-white/5">
                        <div>
                            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mb-6 text-primary transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-bold tracking-tight">Flexible Learning</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">Adapt your education to your lifestyle. Access cutting-edge materials and expert sessions on your schedule, empowering you to learn at your own pace without sacrificing depth or quality.</p>
                        </div>
                    </GlowCard>
                    
                    <GlowCard className="floral-glass p-10 rounded-3xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border border-white/5">
                        <div>
                            <div className="w-16 h-16 bg-secondary/20 border border-secondary/30 rounded-2xl flex items-center justify-center mb-6 text-secondary transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-bold tracking-tight">Global Opportunities</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">The internet has no borders. Equip yourself with skills that are in demand worldwide, opening doors to international clients, remote roles, and expansive networks.</p>
                        </div>
                    </GlowCard>
                    
                    <GlowCard className="floral-glass p-10 rounded-3xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border border-white/5">
                        <div>
                            <div className="w-16 h-16 bg-tertiary/20 border border-tertiary/30 rounded-2xl flex items-center justify-center mb-6 text-tertiary transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>construction</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-bold tracking-tight">Practical Skills</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">Move beyond theory. Our training focuses on actionable, real-world applications that you can implement immediately to drive results and build tangible assets online.</p>
                        </div>
                    </GlowCard>
                    
                    <GlowCard className="floral-glass p-10 rounded-3xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border border-white/5">
                        <div>
                            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mb-6 text-primary transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>model_training</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-bold tracking-tight">Expert Guidance</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">Learn directly from seasoned professionals who have navigated the digital landscape. Benefit from their insights, avoid common pitfalls, and accelerate your path to success.</p>
                        </div>
                    </GlowCard>
                </section>
                
                <section className="mt-24 text-center">
                    <GlowCard className="floral-glass-heavy p-12 md:p-16 rounded-[3rem] ambient-shadow relative overflow-hidden border border-white/10">
                        <div className="absolute -top-[50%] -right-[20%] w-[100%] h-[100%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
                        <div className="absolute -bottom-[50%] -left-[20%] w-[100%] h-[100%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
                        <div className="relative z-10">
                            <h2 className="font-display text-3xl md:text-4xl mb-6 font-bold tracking-tight text-gradient-shimmer">Ready to Transform Your Skills?</h2>
                            <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">Join thousands of others who have elevated their careers and businesses through our comprehensive digital training program.</p>
                            <a href="/#contact" className="inline-block bg-primary text-black px-10 py-4 rounded-xl font-sans font-bold uppercase tracking-wider hover:bg-primary-container transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1">
                                Get Started Today
                            </a>
                        </div>
                    </GlowCard>
                </section>
            </main>
            <Footer />
        </div>
    );
}
