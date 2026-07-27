import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CookiePolicy() {
    return (
        <div className="bg-transparent min-h-screen text-on-surface font-body-base pt-32 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto px-margin-mobile md:px-gutter pb-24">
                <h1 className="font-display-lg text-display-lg text-primary mb-8 animate-in slide-in-from-bottom-4">Cookie Policy</h1>
                <div className="glass-card rounded-2xl p-8 md:p-12 text-on-surface-variant space-y-6 animate-in slide-in-from-bottom-8">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <h2 className="text-xl font-bold text-slate-light mt-6">1. What Are Cookies</h2>
                    <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">2. How We Use Cookies</h2>
                    <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

                    <h2 className="text-xl font-bold text-slate-light mt-6">3. The Cookies We Set</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration.</li>
                        <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
                        <li><strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-light mt-6">4. Third Party Cookies</h2>
                    <p>In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
                    <p>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
