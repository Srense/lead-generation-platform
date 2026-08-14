import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CookiePolicy() {
    return (
        <div className="bg-transparent min-h-screen text-on-surface font-sans pt-32 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-margin-mobile md:px-gutter pb-24">
                <h1 className="font-display text-4xl md:text-5xl text-primary mb-10 font-bold">Cookie Policy</h1>
                <div className="floral-glass rounded-3xl p-10 md:p-14 text-on-surface-variant space-y-8 ambient-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
                    <p className="font-sans text-sm relative z-10">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">1. What Are Cookies</h2>
                        <p className="font-sans leading-relaxed">As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">2. How We Use Cookies</h2>
                        <p className="font-sans leading-relaxed">We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">3. The Cookies We Set</h2>
                        <ul className="list-disc pl-6 space-y-4 font-sans leading-relaxed">
                            <li><strong>Account related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration.</li>
                            <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
                            <li><strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it.</li>
                        </ul>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold text-on-surface mb-4">4. Third Party Cookies</h2>
                        <p className="font-sans leading-relaxed mb-4">In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
                        <p className="font-sans leading-relaxed">This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
