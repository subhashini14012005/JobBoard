import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand-logo">
          <Briefcase size={26} color="#818cf8" />
          <span>CareerPulse</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            Browse Jobs
          </Link>

          {user ? (
            <>
              {user.role === 'employer' && (
                <Link to="/post-job" className={`nav-item ${location.pathname === '/post-job' ? 'active' : ''}`}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <PlusCircle size={16} /> Post a Job
                  </span>
                </Link>
              )}

              <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <LayoutDashboard size={16} /> Dashboard
                </span>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginLeft: '0.5rem' }}>
                <span className="badge badge-fulltime" style={{ textTransform: 'capitalize' }}>
                  <User size={13} /> {user.name} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
