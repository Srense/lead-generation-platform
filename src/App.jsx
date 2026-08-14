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
import UrgencyController from './pages/admin/UrgencyController';

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
          <div className="absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-primary-container/40 blur-[120px] mix-blend-multiply animate-float"></div>
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
        {/* Vibrant iOS-style Background Meshes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[0] bg-[#f8f9fa]">
          <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/40 blur-[140px] animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-secondary/50 blur-[160px] animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[30%] left-[10%] w-[90vw] h-[90vw] rounded-full bg-tertiary/40 blur-[150px] animate-float" style={{ animationDuration: '18s', animationDelay: '5s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[50vw] h-[50vw] rounded-full bg-primary-container/60 blur-[130px] animate-float" style={{ animationDuration: '25s', animationDelay: '1s' }}></div>
        </div>

        {/* Core Router */}
        <div className="relative z-10 w-full flex flex-col min-h-screen">
          <AnimatedRoutes />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
