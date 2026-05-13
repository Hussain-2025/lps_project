import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { env } from "../lib/env";

const SCHOOL_PHONE_DISPLAY = "+91 11 46036232";
const SCHOOL_PHONE_TEL = "+911146036232";
const SCHOOL_EMAIL = "lpschoolnlp@gmail.com";

function Brand() {
  return (
    <NavLink className="brand" to="/">
      <img alt="LPSNLP logo" src="/logo.png" />
    </NavLink>
  );
}

function IconPhone() {
  return (
    <svg aria-hidden="true" className="header-utility-icon-svg" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 3.9 3 3.3 3.4 3 4 3h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1L6.6 10.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg aria-hidden="true" className="header-utility-icon-svg" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6h16v12H4V6Zm0 0 8 6 8-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg aria-hidden="true" className="header-utility-icon-svg" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 13.5h2.5l1-4H14v-1.3c0-1 .3-1.9 1.9-1.9H18V3.1c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8V9.5H7v4h3.5V21H14V13.5Z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg aria-hidden="true" className="header-utility-icon-svg" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9A2.7 2.7 0 0 0 7.5 19.2h9a2.7 2.7 0 0 0 2.7-2.7v-9A2.7 2.7 0 0 0 16.5 4.8h-9ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm4.95-3.15a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
    </svg>
  );
}

function navClass(isActive: boolean, ...extras: string[]) {
  return ["nav-link", ...extras.filter(Boolean), isActive ? "active" : ""].filter(Boolean).join(" ");
}

export function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-utility">
          <div className="container header-utility-inner">
            <Brand />
            <div className="header-contact-cluster">
              <a className="header-contact-block" href={`tel:${SCHOOL_PHONE_TEL}`}>
                <span className="header-icon-circle" aria-hidden="true">
                  <IconPhone />
                </span>
                <span className="header-contact-text">
                  <span className="header-contact-label">Call Us</span>
                  <span className="header-contact-value">{SCHOOL_PHONE_DISPLAY}</span>
                </span>
              </a>
              <a className="header-contact-block" href={`mailto:${SCHOOL_EMAIL}`}>
                <span className="header-icon-circle" aria-hidden="true">
                  <IconMail />
                </span>
                <span className="header-contact-text">
                  <span className="header-contact-label">Mail Us</span>
                  <span className="header-contact-value">{SCHOOL_EMAIL}</span>
                </span>
              </a>
              <div className="header-social" role="group" aria-label="Social media">
                <a
                  className="header-social-link"
                  href="https://www.facebook.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Facebook"
                >
                  <IconFacebook />
                </a>
                <a
                  className="header-social-link"
                  href="https://www.instagram.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Instagram"
                >
                  <IconInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="header-nav-strip">
          <div className="container header-nav-inner">
            <nav aria-label="Primary" className="nav-bar">
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link--home")} end to="/">
                Home
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/about">
                About
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/academics">
                Academics
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/activities">
                Activities
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/gallery">
                Gallery
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/community">
                Community
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/admission">
                Admission
              </NavLink>
              <NavLink className={({ isActive }) => navClass(isActive, "nav-link-dropdown")} to="/contact">
                Contact
              </NavLink>
            </nav>
            <div className="header-actions">
              {user ? (
                <>
                  <NavLink
                    className="button button-header-portal"
                    to={user.role === "admin" || user.role === "super_admin" ? "/admin" : `/erp/${user.role}`}
                  >
                    Portal
                  </NavLink>
                  <button
                    className="button button-header-logout"
                    onClick={() => {
                      void logout().then(() => navigate("/"));
                    }}
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink className="button button-erp-login" to="/erp/login">
                  ERP Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
        <div className="admission-ribbon-bar">
          <div className="container admission-ribbon-wrap">
            <Link
              aria-label="Admission open 2026–27. Go to admission application."
              className="admission-ribbon-button"
              to="/admission"
            >
              Admission open 2026-27
            </Link>
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
