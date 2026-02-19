import { useState } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAnalytics } from './components/AdminAnalytics';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('podFinder_isAdmin') === 'true'
  );

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const isAnalytics = window.location.pathname.startsWith('/admin/analytics');

  if (isAnalytics) {
    return <AdminAnalytics onLogout={handleLogout} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
