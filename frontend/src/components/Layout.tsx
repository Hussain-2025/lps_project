import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { env } from "../lib/env";

function Brand() {
  return (
    <NavLink className="brand" to="/">
      <img alt="LPSNLP logo" src="/lpsnlp-logo.svg" />
      <span>
        <strong>LPSNLP School</strong>
        <small>{env.VITE_SCHOOL_NAME}</small>
      </span>
    </NavLink>
  );
}

export function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-grid">
          <Brand />
          <nav className="nav-bar">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/academics">Academics</NavLink>
            <NavLink to="/activities">Activities</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/admission">Admission</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <NavLink className="button button-secondary" to={user.role === "admin" || user.role === "super_admin" ? "/admin" : `/erp/${user.role}`}>
                  Portal
                </NavLink>
                <button
                  className="button button-ghost"
                  onClick={() => {
                    void logout().then(() => navigate("/"));
                  }}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink className="button button-secondary" to="/erp/login">
                ERP Login
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>Lovely Public Sr. Sec. School</h3>
            <p>New Layal Pur, Delhi · Est. 1966 · CBSE Affiliated</p>
          </div>
          <div>
            <p>Phone: 011 4603 6232</p>
            <p>School-first digital experience for admissions, notices, and community updates.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand />
        <nav className="admin-nav">
          <NavLink to="/admin">Overview</NavLink>
          <NavLink to="/admin/admissions">Admissions</NavLink>
          <NavLink to="/admin/notices">Notices</NavLink>
          <NavLink to="/admin/gallery">Gallery</NavLink>
          <NavLink to="/">Public Site</NavLink>
        </nav>
        <div className="admin-profile">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
          <button
            className="button button-secondary"
            onClick={() => {
              void logout().then(() => navigate("/"));
            }}
            type="button"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
