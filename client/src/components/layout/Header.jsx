import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <NavLink
          to="/"
          className="brand"
          aria-label="LocalFind home"
        >
          Local<span>Find</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/businesses">
            Businesses
          </NavLink>

          <a href="/#categories">
            Categories
          </a>

          {user ? (
            <>
              {user.role === 'businessOwner' && (
                <NavLink to="/owner">
                  My business
                </NavLink>
              )}
              {user.role === 'customer' && (
                <NavLink to="/enquiries">
                  My enquiries
                </NavLink>
              )}

              <NavLink
                className="user-name"
                to="/account"
              >
                Hi, {user.name.split(' ')[0]}
              </NavLink>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                Log in
              </NavLink>

              <NavLink
                className="nav-join"
                to="/register"
              >
                Join
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}