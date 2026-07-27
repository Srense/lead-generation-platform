import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Success from './pages/Success';
import Benefits from './pages/Benefits';
import ContactUs from './pages/ContactUs';
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
    <div key={location.pathname} className="animate-fade-in">
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
        <Route path="/benefits" element={<Benefits />} />
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
  return (
    <AdminProvider>
      <Router>
        {/* Global Liquid Plasma Mesh */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1] bg-[#0A0F20]">
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[130px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-sky-500/10 blur-[120px] mix-blend-screen" style={{ animation: 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate-reverse' }}></div>
        </div>

        {/* Core Router */}
        <div className="relative z-10 w-full h-full flex flex-col min-h-screen">
          <AnimatedRoutes />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
