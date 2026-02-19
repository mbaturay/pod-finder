import { useState } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('podFinder_isAdmin') === 'true'
  );

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        setIsAuthenticated(false);
        window.location.href = '/';
      }}
    />
  );
}
