import React from 'react';
import { useEffect, useState } from 'react';
import { adminApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const statuses = [
  'pending',
  'approved',
  'rejected',
  'suspended',
];

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  async function loadBusinesses() {
    setLoading(true);
    setError('');

    try {
      const { businesses: items } =
        await adminApi.businesses(token);

      setBusinesses(items);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBusinesses();
  }, [token]);

  async function updateStatus(businessId, status) {
    setUpdatingId(businessId);
    setError('');

    try {
      const { business } =
        await adminApi.updateBusinessStatus(
          token,
          businessId,
          status,
        );

      setBusinesses((current) =>
        current.map((item) =>
          item._id === business._id
            ? business
            : item,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId('');
    }
  }

  const filteredBusinesses =
    filter === 'all'
      ? businesses
      : businesses.filter(
          (business) => business.status === filter,
        );

  const counts = {
    all: businesses.length,
    pending: businesses.filter(
      (business) => business.status === 'pending',
    ).length,
    approved: businesses.filter(
      (business) => business.status === 'approved',
    ).length,
    rejected: businesses.filter(
      (business) => business.status === 'rejected',
    ).length,
    suspended: businesses.filter(
      (business) => business.status === 'suspended',
    ).length,
  };

  return (
    <section className="container admin-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Administration</p>

          <h1>Admin Dashboard</h1>

          <p className="page-copy">
            Manage LocalFind business listings.
          </p>
        </div>
      </div>

      {error && (
        <p className="form-error">{error}</p>
      )}

      <div className="admin-stats">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          <strong>{counts.all}</strong>
          <span>Total</span>
        </button>

        <button
          type="button"
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          <strong>{counts.pending}</strong>
          <span>Pending</span>
        </button>

        <button
          type="button"
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          <strong>{counts.approved}</strong>
          <span>Approved</span>
        </button>

        <button
          type="button"
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          <strong>{counts.rejected}</strong>
          <span>Rejected</span>
        </button>

        <button
          type="button"
          className={filter === 'suspended' ? 'active' : ''}
          onClick={() => setFilter('suspended')}
        >
          <strong>{counts.suspended}</strong>
          <span>Suspended</span>
        </button>
      </div>

      {loading ? (
        <p>Loading businesses…</p>
      ) : filteredBusinesses.length === 0 ? (
        <p className="page-copy">
          No businesses found for this filter.
        </p>
      ) : (
        <div className="admin-business-list">
          {filteredBusinesses.map((business) => (
            <article
              className="admin-business-card"
              key={business._id}
            >
              <div className="admin-business-header">
                <div>
                  <span
                    className={`status status-${business.status}`}
                  >
                    {business.status}
                  </span>

                  <h2>{business.name}</h2>

                  <p>
                    {business.category} · {business.area},{' '}
                    {business.city}
                  </p>
                </div>
              </div>

              <div className="admin-business-info">
                <p>
                  <strong>Owner:</strong>{' '}
                  {business.owner?.name || 'Unknown'}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {business.owner?.email || 'Not available'}
                </p>

                <p>
                  <strong>Phone:</strong>{' '}
                  {business.phone || 'Not available'}
                </p>

                <p>
                  <strong>Address:</strong>{' '}
                  {business.address}
                </p>
              </div>

              <div className="admin-business-actions">
                {statuses
                  .filter(
                    (status) => status !== business.status,
                  )
                  .map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={
                        updatingId === business._id
                      }
                      onClick={() =>
                        updateStatus(
                          business._id,
                          status,
                        )
                      }
                    >
                      {updatingId === business._id
                        ? 'Updating…'
                        : status === 'approved'
                          ? 'Approve'
                          : status === 'rejected'
                            ? 'Reject'
                            : status === 'suspended'
                              ? 'Suspend'
                              : 'Set Pending'}
                    </button>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}