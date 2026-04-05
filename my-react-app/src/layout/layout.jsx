import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const NAV_ITEMS = [
  { path: '/ics-committee', label: 'Scheduling Committee' },
  { path: '/ics-faculty',   label: 'ICS Faculty'          },
  { path: '/chairman-home', label: 'ICS Courses'          },
  { path: '/teaching-load', label: 'Teaching Load'        },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentLabel = NAV_ITEMS.find(i => i.path === location.pathname)?.label ?? '';

  return (
    <div className="layout">

      {/* ── Sidebar ── */}
      <aside className="layout__sidebar">

        {/* Logo */}
        <div className="layout__logo">
          <div className="layout__logo-icon">⊙</div>
          <span className="layout__logo-text">Khuta</span>
        </div>

        {/* Nav */}
        <nav className="layout__nav">
          <div className="layout__nav-label">Menu</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              className={`nav-link${location.pathname === item.path ? ' nav-link--active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="layout__footer">
          <div className="layout__user">
            <div className="layout__user-avatar">M</div>
            <div>
              <div className="layout__user-name">Malak</div>
              <div className="layout__user-role">ICS Chairman</div>
            </div>
          </div>
          <button className="btn-logout" onClick={() => navigate('/')}>
            Log Out
          </button>
        </div>

      </aside>

      {/* ── Main ── */}
      <div className="layout__body">

        {/* Topbar */}
        <header className="layout__topbar">
          <div className="layout__topbar-breadcrumb">
            <span className="bc-root">ICS</span>
            <span className="bc-sep">›</span>
            <span className="bc-current">{currentLabel}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="layout__content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}