import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ navItems, userName, userRole, rootLabel }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLabel = navItems.find(i => i.path === location.pathname)?.label ?? '';

  return (
    <div className="layout">

      {/* Dark overlay — mobile only, closes sidebar when clicked */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`layout__sidebar${menuOpen ? ' layout__sidebar--open' : ''}`}>

        <div className="layout__logo">
          <span className="layout__logo-text">Khuta</span>
        </div>

        <nav className="layout__nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`layout__nav-link${location.pathname === item.path ? ' layout__nav-link--active' : ''}`}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="layout__footer">
          <div className="layout__user">
            <div className="layout__user-avatar">{userName?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="layout__user-name">{userName}</div>
              <div className="layout__user-role">{userRole}</div>
            </div>
          </div>
          <button className="layout__btn-logout" onClick={() => navigate('/')}>Log Out</button>
        </div>

      </aside>

      {/* Main */}
      <div className="layout__body">

        <header className="layout__topbar">
          {/* Hamburger button — visible on mobile only */}
          <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <div className="layout__breadcrumb">
            <span className="layout__breadcrumb-root">{rootLabel}</span>
            <span className="layout__breadcrumb-sep">›</span>
            <span className="layout__breadcrumb-current">{currentLabel}</span>
          </div>
        </header>

        <main className="layout__content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}