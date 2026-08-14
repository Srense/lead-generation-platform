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
        {/* Elegant Organic Background Meshes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[0] bg-background">
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/30 blur-[120px] animate-float" style={{ animationDuration: '10s' }}></div>
          <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[60vw] rounded-[100%] bg-secondary-container/40 blur-[130px] mix-blend-multiply animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-tertiary-container/30 blur-[120px] mix-blend-multiply animate-float" style={{ animationDuration: '15s', animationDelay: '4s' }}></div>
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
