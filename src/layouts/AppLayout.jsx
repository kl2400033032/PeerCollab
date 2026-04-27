import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import NotificationDropdown from '../components/shared/NotificationDropdown';
import ThemeToggle from '../components/shared/ThemeToggle';
import { useAuth } from '../contexts/useAuth';
import { getStoredTheme, saveTheme } from '../utils/storage';

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg glass-nav border-bottom sticky-top">
        <div className="container py-2">
          <NavLink to="/dashboard" className="navbar-brand fw-bold text-primary">
            PeerCollab
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="appNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
              <NavLink to="/projects" className="nav-link">Projects</NavLink>
              {user?.role === 'STUDENT' ? <NavLink to="/projects/add" className="nav-link">Add Project</NavLink> : null}
              <NotificationDropdown user={user} />
              <ThemeToggle theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
              <span className="filter-chip">{user?.name} · {user?.role}</span>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
