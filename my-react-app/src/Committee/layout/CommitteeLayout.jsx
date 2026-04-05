import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/main.css';

const NAV_ITEMS = [
  { path: '/committee/assign-courses', label: 'Assign Courses' },
  { path: '/committee/manage-terms',   label: 'Manage Terms'   },
  { path: '/committee/manage-courses', label: 'Manage Courses' },
];

export default function CommitteeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLabel = NAV_ITEMS.find(i => i.path === location.pathname)?.label;

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="layout__sidebar">

        <div className="layout__logo">
          <span className="layout__logo-text">⊙ Khuta</span>
        </div>

        <nav className="layout__nav">
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

        <div className="layout__footer">
          <div className="layout__user">
            <div className="layout__user-avatar">👤</div>
            <div>
              <div className="layout__user-name">Hamdi</div>
              <div className="layout__user-role">Committee member</div>
            </div>
          </div>
          <button
            className="btn-logout"
            onClick={() => navigate('/')}
          >
            Log Out
          </button>
        </div>

      </aside>

      {/* Main */}
      <div className="layout__body">

        <header className="layout__topbar">
          <div className="layout__topbar-breadcrumb">
            <span className="bc-root">Committee</span>
            <span className="bc-sep">›</span>
            <span className="bc-current">{currentLabel}</span>
          </div>
        </header>

        <main className="layout__content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}