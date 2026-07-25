import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Success from './pages/Success';
import Benefits from './pages/Benefits';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import { AdminProvider } from './context/AdminContext';

import LeadsViewer from './pages/admin/LeadsViewer';
import VideoManager from './pages/admin/VideoManager';
import UrgencyController from './pages/admin/UrgencyController';

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/success" element={<Success />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Secure Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="leads" element={<LeadsViewer />} />
            <Route path="video" element={<VideoManager />} />
            <Route path="urgency" element={<UrgencyController />} />
          </Route>
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
