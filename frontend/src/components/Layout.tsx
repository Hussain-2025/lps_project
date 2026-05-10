import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { env } from "../lib/env";

function Brand() {
  return (
    <NavLink className="brand" to="/">
      <img alt="LPSNLP logo" src="/logo.png" />
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
          <div className="footer-card">
            <h3>About LPSNLP</h3>
            <p>
              RPM Lovely Public Senior Secondary School combines strong academic roots with a modern
              digital experience for families, students, and the whole school community.
            </p>
          </div>
          <div className="footer-card">
            <h3>Contact Information</h3>
            <p>251 New Layalpur, East Delhi, India</p>
            <p>Phone: +91 11 46036232</p>
            <p>
              Email: <a href="mailto:lpschoolnlp@gmail.com">lpschoolnlp@gmail.com</a>
            </p>
          </div>
          <div className="footer-card footer-actions">
            <h3>Quick links</h3>
            <div className="footer-links-grid">
              <Link className="button button-secondary footer-button" to="/contact">
                Contact Us
              </Link>
              <Link className="button button-secondary footer-button" to="/privacy">
                Privacy Policy
              </Link>
              <Link className="button button-secondary footer-button" to="/terms">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Lovely Public School. All Rights Reserved.</p>
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
