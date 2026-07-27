import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
export default function Benefits() {
    return (
        <div className="bg-transparent text-on-background min-h-screen flex flex-col">
            {/* TopNavBar */}
            <Navbar />
            {/* Main Content */}
            <main className="flex-grow pt-32 pb-section-gap-mobile md:pb-section-gap px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
                {/* Hero Section */}
                <section className="text-center mb-16 md:mb-24">
                    <h1 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-on-surface mb-6">Master the Digital Age</h1>
                    <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">Unlock your potential with skills designed for the modern internet. Discover the advantages of expert-led digital training.</p>
                </section>
                {/* Benefits Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Benefit 1 */}
                    <div className="glass-card p-8 rounded-xl border border-glass-border ambient-shadow flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div>
                            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                            </div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Flexible Learning</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Adapt your education to your lifestyle. Access cutting-edge materials and expert sessions on your schedule, empowering you to learn at your own pace without sacrificing depth or quality.</p>
                        </div>
                    </div>
                    {/* Benefit 2 */}
                    <div className="glass-card p-8 rounded-xl border border-glass-border ambient-shadow flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div>
                            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
                            </div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Global Opportunities</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">The internet has no borders. Equip yourself with skills that are in demand worldwide, opening doors to international clients, remote roles, and expansive networks.</p>
                        </div>
                    </div>
                    {/* Benefit 3 */}
                    <div className="glass-card p-8 rounded-xl border border-glass-border ambient-shadow flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div>
                            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>construction</span>
                            </div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Practical Skills</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Move beyond theory. Our training focuses on actionable, real-world applications that you can implement immediately to drive results and build tangible assets online.</p>
                        </div>
                    </div>
                    {/* Benefit 4 */}
                    <div className="glass-card p-8 rounded-xl border border-glass-border ambient-shadow flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div>
                            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>model_training</span>
                            </div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Expert Guidance</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Learn directly from seasoned professionals who have navigated the digital landscape. Benefit from their insights, avoid common pitfalls, and accelerate your path to success.</p>
                        </div>
                    </div>
                </section>
                {/* CTA Section */}
                <section className="mt-24 text-center">
                    <div className="glass-card p-12 rounded-xl border border-glass-border ambient-shadow">
                        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-6">Ready to Transform Your Trajectory?</h2>
                        <p className="font-body-base text-body-base text-on-surface-variant mb-8 max-w-xl mx-auto">Join a community of forward-thinkers and start mastering the digital tools that define tomorrow.</p>
                        <button className="bg-primary text-on-primary-fixed font-label-caps text-label-caps px-8 py-4 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 shadow-lg">Start Learning Today</button>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
}
