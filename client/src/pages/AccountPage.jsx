import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <section className="container account-page">
      <p className="eyebrow">Your account</p>

      <h1>Welcome, {user.name}</h1>

      <p>
        You are signed in as a <strong>{user.role}</strong>.
      </p>

      {user.role === 'customer' && (
        <div className="account-actions">
          <Link className="button-link" to="/enquiries">
            My Enquiries
          </Link>
        </div>
      )}
    </section>
  );
}