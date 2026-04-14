import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import TDRServices from './pages/TDRServices';
import BlockchainVerification from './pages/BlockchainVerification';

import { AdminProvider } from './context/AdminContext';
import { CertificateProvider } from './context/CertificateContext';
import { UserProvider } from './context/UserContext';
import Profile from './pages/Profile';
import Registration from './pages/Registration';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <CertificateProvider>
        <BrowserRouter>
        <Routes>
          {/* Standalone Route without Header/Sidebar Layout */}
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/admin/*" element={<AdminPortal />} />

          {/* Standard Application Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="services" element={<TDRServices />} />
            <Route path="verification" element={<BlockchainVerification />} />
            <Route path="profile" element={<Profile />} />
            <Route path="register" element={<Registration />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </CertificateProvider>
      </UserProvider>
    </AdminProvider>
  );
}

export default App;
