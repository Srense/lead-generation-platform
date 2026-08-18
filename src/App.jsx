import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader';
import Dashboard from './pages/Dashboard';
import Success from './pages/Success';
import Benefits from './pages/Benefits';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import { AdminProvider } from './context/AdminContext';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

import LeadsViewer from './pages/admin/LeadsViewer';
import ContactsViewer from './pages/admin/ContactsViewer';
import VideoManager from './pages/admin/VideoManager';
import BootcampManager from './pages/admin/BootcampManager';
import UrgencyController from './pages/admin/UrgencyController';

import FloatingSocials from './components/FloatingSocials';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in w-full flex-grow flex flex-col">
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* Secure Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="leads" element={<LeadsViewer />} />
          <Route path="contacts" element={<ContactsViewer />} />
          <Route path="video" element={<VideoManager />} />
          <Route path="bootcamp" element={<BootcampManager />} />
          <Route path="urgency" element={<UrgencyController />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-blob"></div>
        </div>
        <div className="relative z-10">
          <Loader size="lg" text="Crafting Experience" />
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <Router>
        {/* Fintech Dark Mode Background Meshes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[0] bg-[#09090B]">
          {/* Subtle Grid for depth */}
          <div className="absolute inset-0 opacity-[0.04] animate-grid-pan" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Neon Glow Orbs */}
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px] animate-blob"></div>
          <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-secondary/15 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-tertiary/10 blur-[130px] animate-blob" style={{ animationDelay: '5s' }}></div>

          {/* Multiverse SVG Filter */}
          <svg className="hidden">
            <filter id="loki-multiverse">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.004" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="120" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          {/* Loki Multiverse Flow */}
          <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen" style={{ filter: 'url(#loki-multiverse)' }}>
            
            {/* Flowing Cosmic Energy Clouds */}
            <div className="absolute top-0 left-0 w-[100vw] h-[200vh] animate-multiverse-flow"
                 style={{
                   backgroundImage: `
                     radial-gradient(circle at 20% 10%, rgba(16, 185, 129, 0.8) 0%, transparent 40vw),
                     radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.5) 0%, transparent 40vw),
                     radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.9) 0%, transparent 30vw),
                     radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.6) 0%, transparent 40vw),
                     linear-gradient(to top, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1))
                   `,
                   backgroundSize: '100% 50%' // Essential for the seamless translateY(-50%) loop
                 }}>
            </div>
            
            {/* Multiverse Timelines / Threads */}
            <div className="absolute top-0 left-0 w-full h-[200vh] animate-multiverse-flow flex justify-evenly opacity-50">
                <div className="w-[3px] h-full" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.8) 0%, transparent 10%, rgba(16, 185, 129, 0.8) 20%)', backgroundSize: '100% 12.5%' }}></div>
                <div className="w-[1px] h-full" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.6) 0%, transparent 30%, rgba(59, 130, 246, 0.6) 60%)', backgroundSize: '100% 25%' }}></div>
                <div className="w-[4px] h-full" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.9) 0%, transparent 15%, rgba(16, 185, 129, 0.9) 30%)', backgroundSize: '100% 10%' }}></div>
                <div className="w-[2px] h-full" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 0%, transparent 40%, rgba(16, 185, 129, 0.5) 80%)', backgroundSize: '100% 25%' }}></div>
                <div className="w-[3px] h-full" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.7) 0%, transparent 20%, rgba(59, 130, 246, 0.7) 40%)', backgroundSize: '100% 50%' }}></div>
            </div>
          </div>
        </div>

        {/* Core Router */}
        <div className="relative z-10 w-full flex flex-col min-h-screen">
          <AnimatedRoutes />
        </div>

        {/* Floating Social Action Buttons */}
        <FloatingSocials />
      </Router>
    </AdminProvider>
  );
}

export default App;
