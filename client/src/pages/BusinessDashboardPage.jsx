import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessApi, enquiryApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BusinessDashboardPage() {
  const { user, token } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const { businesses: items } =
          await businessApi.mine(token);

        setBusinesses(items);

        const enquiryResults = await Promise.all(
          items.map(async (business) => {
            try {
              const { enquiries: businessEnquiries } =
                await enquiryApi.business(
                  token,
                  business._id,
                );

              return businessEnquiries;
            } catch {
              return [];
            }
          }),
        );

        setEnquiries(enquiryResults.flat());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  const approvedBusinesses = businesses.filter(
    (business) => business.status === 'approved',
  ).length;

  const pendingBusinesses = businesses.filter(
    (business) => business.status === 'pending',
  ).length;

  const newEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === 'new',
  ).length;

  const resolvedEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === 'resolved',
  ).length;

  return (
    <section className="container owner-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Business owner</p>

          <h1>Welcome, {user?.name}</h1>

          <p className="page-copy">
            Manage your LocalFind businesses and keep track
            of customer enquiries.
          </p>
        </div>

        <Link
          className="button-link"
          to="/owner/businesses/new"
        >
          Add business
        </Link>
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {loading ? (
        <p className="state-message">
          Loading dashboard…
        </p>
      ) : (
        <>
          <div className="dashboard-stats">
            <article className="dashboard-stat">
              <span>Total businesses</span>
              <strong>{businesses.length}</strong>
            </article>

            <article className="dashboard-stat">
              <span>Approved</span>
              <strong>{approvedBusinesses}</strong>
            </article>

            <article className="dashboard-stat">
              <span>Pending</span>
              <strong>{pendingBusinesses}</strong>
            </article>

            <article className="dashboard-stat">
              <span>Total enquiries</span>
              <strong>{enquiries.length}</strong>
            </article>

            <article className="dashboard-stat">
              <span>New enquiries</span>
              <strong>{newEnquiries}</strong>
            </article>

            <article className="dashboard-stat">
              <span>Resolved</span>
              <strong>{resolvedEnquiries}</strong>
            </article>
          </div>

          <div className="dashboard-sections">
            <article className="dashboard-panel">
              <p className="eyebrow">
                Businesses
              </p>

              <h2>Manage your businesses</h2>

              <p className="page-copy">
                View your listings, update business
                information, manage photos, and check
                approval status.
              </p>

              <Link
                className="button-link"
                to="/owner/businesses"
              >
                My businesses
              </Link>
            </article>

            <article className="dashboard-panel">
              <p className="eyebrow">
                Enquiries
              </p>

              <h2>Customer requests</h2>

              <p className="page-copy">
                You have {newEnquiries}{' '}
                {newEnquiries === 1
                  ? 'new enquiry'
                  : 'new enquiries'}{' '}
                waiting for your attention.
              </p>

              <Link
                className="text-link"
                to="/owner/businesses"
              >
                View enquiries →
              </Link>
            </article>
          </div>
        </>
      )}
    </section>
  );
}