import React from 'react';
import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authApi } from '../services/api.js';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';

  const { saveSession } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const values = Object.fromEntries(
      new FormData(event.currentTarget),
    );

    setError('');
    setSubmitting(true);

    try {
      const session = await (
        isRegister
          ? authApi.register(values)
          : authApi.login(values)
      );

      saveSession(session);
      if (session.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (session.user.role === 'businessOwner') {
        navigate('/owner', { replace: true });
      } else {
        const previousPage =
          location.state?.from?.pathname;

        navigate(previousPage || '/businesses', {
          replace: true,
        });
      }

    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-section container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <p className="eyebrow">
          LocalFind account
        </p>

        <h1>
          {isRegister
            ? 'Create your account'
            : 'Welcome back'}
        </h1>

        <p className="auth-copy">
          {isRegister
            ? 'Start discovering Hyderabad businesses.'
            : 'Log in to continue with LocalFind.'}
        </p>

        {error && (
          <p
            className="form-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {isRegister && (
          <label>
            Name

            <input
              name="name"
              required
              minLength="2"
              autoComplete="name"
            />
          </label>
        )}

        <label>
          Email

          <input
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>

        <label>
          Password

          <input
            name="password"
            type="password"
            required
            minLength="8"
            autoComplete={
              isRegister
                ? 'new-password'
                : 'current-password'
            }
          />
        </label>

        {isRegister && (
          <label>
            I am a

            <select
              name="role"
              defaultValue="customer"
            >
              <option value="customer">
                Customer
              </option>

              <option value="businessOwner">
                Business owner
              </option>
            </select>
          </label>
        )}

        <button disabled={submitting}>
          {submitting
            ? 'Please wait…'
            : isRegister
              ? 'Create account'
              : 'Log in'}
        </button>

        <p className="auth-switch">
          {isRegister
            ? 'Already have an account?'
            : 'New to LocalFind?'}{' '}

          <Link
            to={
              isRegister
                ? '/login'
                : '/register'
            }
          >
            {isRegister
              ? 'Log in'
              : 'Create one'}
          </Link>
        </p>
      </form>
    </section>
  );
}