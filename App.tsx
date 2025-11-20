import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { HospitalDashboard } from './pages/HospitalDashboard';
import { MapPage } from './pages/MapPage';
import { HealthAssistant } from './pages/HealthAssistant';
import { IoTMonitor } from './pages/IoTMonitor';
import { EmergencySOS } from './pages/EmergencySOS';
import { MedicalTracker, InsuranceTracker, MassAlerts, SettingsPage, CommunityPage } from './pages/SecondaryPages';
import { StaffManagement, BedAllocation, Pharmacy, Billing, Appointments } from './pages/AdminModules';
import { Auth } from './pages/Auth';
import { Page, UserRole } from './types';
import { Card, CardContent } from './components/Common';
import { HospitalProvider } from './contexts/HospitalContext';
import { UserProvider, useUser } from './contexts/UserContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useUser();
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Reset page on login based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentPage(user.role === 'admin' ? Page.ADMIN_DASHBOARD : Page.DASHBOARD);
    }
  }, [isAuthenticated, user]);


  const renderPage = () => {
    // ADMIN ROUTES
    if (user?.role === 'admin') {
        switch (currentPage) {
            case Page.ADMIN_DASHBOARD: return <HospitalDashboard />;
            case Page.STAFF_MANAGEMENT: return <StaffManagement />;
            case Page.BED_ALLOCATION: return <BedAllocation />;
            case Page.PHARMACY: return <Pharmacy />;
            case Page.BILLING: return <Billing />;
            case Page.APPOINTMENTS: return <Appointments />;
            case Page.ALERTS: return <HospitalDashboard />; // Alerts integrated in Dashboard for now
            case Page.SETTINGS: return <SettingsPage theme={theme} onToggleTheme={toggleTheme} />;
            default: return <HospitalDashboard />;
        }
    }

    // PATIENT ROUTES
    switch (currentPage) {
      case Page.DASHBOARD: return <Dashboard />;
      case Page.MAP: return <MapPage />;
      case Page.CHAT: return <HealthAssistant />;
      case Page.IOT_MONITOR: return <IoTMonitor />;
      case Page.SOS: return <EmergencySOS />;
      case Page.MEDICAL_TRACKER: return <MedicalTracker />;
      case Page.INSURANCE: return <InsuranceTracker />;
      case Page.ALERTS: return <MassAlerts />;
      case Page.SETTINGS: return <SettingsPage theme={theme} onToggleTheme={toggleTheme} />;
      case Page.COMMUNITY: return <CommunityPage />;
      default: return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <HospitalProvider>
        <Layout 
            currentPage={currentPage} 
            onNavigate={setCurrentPage} 
            userRole={user?.role || 'patient'}
            onLogout={logout}
            theme={theme}
            onToggleTheme={toggleTheme}
        >
        {renderPage()}
        </Layout>
    </HospitalProvider>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;