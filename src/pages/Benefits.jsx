import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
export default function Benefits() {
    return (
        <div className="bg-transparent text-on-background min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                <section className="text-center mb-16 md:mb-24">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 font-bold tracking-tight">Elevating Brands through Thoughtful Design</h1>
                    <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Unlock your potential with skills designed for the modern internet. Discover the advantages of expert-led digital training with a delicate approach.</p>
                </section>
                
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="floral-glass p-10 rounded-2xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300">
                        <div>
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-semibold">Flexible Learning</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">Adapt your education to your lifestyle. Access cutting-edge materials and expert sessions on your schedule, empowering you to learn at your own pace without sacrificing depth or quality.</p>
                        </div>
                    </div>
                    
                    <div className="floral-glass p-10 rounded-2xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300">
                        <div>
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-semibold">Global Opportunities</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">The internet has no borders. Equip yourself with skills that are in demand worldwide, opening doors to international clients, remote roles, and expansive networks.</p>
                        </div>
                    </div>
                    
                    <div className="floral-glass p-10 rounded-2xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300">
                        <div>
                            <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>construction</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-semibold">Practical Skills</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">Move beyond theory. Our training focuses on actionable, real-world applications that you can implement immediately to drive results and build tangible assets online.</p>
                        </div>
                    </div>
                    
                    <div className="floral-glass p-10 rounded-2xl ambient-shadow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300">
                        <div>
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>model_training</span>
                            </div>
                            <h3 className="font-display text-2xl text-on-surface mb-4 font-semibold">Expert Guidance</h3>
                            <p className="font-sans text-base text-on-surface-variant leading-relaxed">Learn directly from seasoned professionals who have navigated the digital landscape. Benefit from their insights, avoid common pitfalls, and accelerate your path to success.</p>
                        </div>
                    </div>
                </section>
                
                <section className="mt-24 text-center">
                    <div className="floral-glass-heavy p-12 md:p-16 rounded-3xl ambient-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full"></div>
                        <div className="relative z-10">
                            <h2 className="font-display text-3xl md:text-4xl text-on-surface mb-6 font-bold">Ready to Transform Your Trajectory?</h2>
                            <p className="font-sans text-lg text-on-surface-variant mb-10 max-w-xl mx-auto">Join a community of forward-thinkers and start mastering the digital tools that define tomorrow.</p>
                            <Link to="/#training" className="inline-block bg-primary text-white font-sans font-medium px-10 py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container hover:-translate-y-1 transition-all duration-300 shadow-md">Start Learning Today</Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
