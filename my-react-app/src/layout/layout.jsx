import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../CSS/main.css';

const NAV_ITEMS = [
  { key: "/ics-committee", label: "Scheduling Committee" },
  { key: "/ics-faculty",   label: "ICS Faculty"          },
  { key: "/chairman-home", label: "ICS Courses"          },
  { key: "/teaching-load", label: "Teaching Load"        },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = NAV_ITEMS.find(i => i.key === location.pathname);

  return (
    <div className="layout">
      <aside className="layout__sidebar">

        <div className="layout__logo">
          <div className="layout__logo-icon">⊙</div>
          <span className="layout__logo-text">Khuta</span>
        </div>

        <nav className="layout__nav">
          <div className="layout__nav-section-title">Menu</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`nav-link ${location.pathname === item.key ? "nav-link--active" : ""}`}
              onClick={() => navigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="layout__footer">
          <div className="layout__user">
            <div className="layout__user-avatar">M</div>
            <div className="layout__user-info">
              <div className="layout__user-name">Malak</div>
              <div className="layout__user-role">ICS Chairman</div>
            </div>
          </div>
          <button className="btn-logout" onClick={() => navigate('/')}>Log Out</button>
        </div>

      </aside>

      <div className="layout__body">
        <header className="layout__topbar">
          <div className="layout__topbar-breadcrumb">
            <span>ICS</span>
            <span>›</span>
            <strong>{current?.label}</strong>
          </div>
        </header>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}