import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessApi, enquiryApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyBusinessesPage() {
  const { token } = useAuth();

  const [businesses, setBusinesses] = useState([]);
  const [enquiries, setEnquiries] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replyingId, setReplyingId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  function load() {
    setLoading(true);
    setError('');

    businessApi
      .mine(token)
      .then(async ({ businesses: items }) => {
        setBusinesses(items);

        const enquiryResults = await Promise.all(
          items.map(async (business) => {
            try {
              const { enquiries: businessEnquiries } =
                await enquiryApi.business(token, business._id);

              return [business._id, businessEnquiries];
            } catch {
              return [business._id, []];
            }
          }),
        );

        setEnquiries(Object.fromEntries(enquiryResults));
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, [token]);

  async function remove(id) {
    if (!window.confirm('Delete this business?')) return;

    try {
      await businessApi.remove(token, id);
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function updateStatus(enquiryId, status) {
    setUpdatingId(enquiryId);
    setError('');

    try {
      const { enquiry } = await enquiryApi.updateStatus(
        token,
        enquiryId,
        status,
      );

      setEnquiries((current) => {
        const updated = { ...current };

        Object.keys(updated).forEach((businessId) => {
          updated[businessId] = updated[businessId].map((item) =>
            item._id === enquiry._id
              ? { ...item, status: enquiry.status }
              : item,
          );
        });

        return updated;
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId('');
    }
  }

  function changeReply(enquiryId, value) {
    setReplyText((current) => ({
      ...current,
      [enquiryId]: value,
    }));
  }

  async function sendReply(enquiryId) {
    const reply = replyText[enquiryId]?.trim();

    if (!reply) {
      setError('Reply cannot be empty.');
      return;
    }

    setReplyingId(enquiryId);
    setError('');

    try {
      const { enquiry } = await enquiryApi.reply(
        token,
        enquiryId,
        reply,
      );

      setEnquiries((current) => {
        const updated = { ...current };

        Object.keys(updated).forEach((businessId) => {
          updated[businessId] = updated[businessId].map((item) =>
            item._id === enquiry._id
              ? {
                  ...item,
                  reply: enquiry.reply,
                  status: enquiry.status,
                }
              : item,
          );
        });

        return updated;
      });

      setReplyText((current) => ({
        ...current,
        [enquiryId]: '',
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setReplyingId('');
    }
  }

  return (
    <section className="container owner-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Business owner</p>
          <h1>My businesses</h1>
        </div>

        <Link className="button-link" to="/owner/businesses/new">
          Add business
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading businesses…</p>
      ) : businesses.length === 0 ? (
        <p className="page-copy">
          You have not added a business yet.
        </p>
      ) : (
        <div className="business-list">
          {businesses.map((business) => {
            const businessEnquiries = enquiries[business._id] || [];

            return (
              <article className="business-row" key={business._id}>
                <div className="business-row-content">
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

                  <div className="owner-business-actions">
                    <Link
                      to={`/owner/businesses/${business._id}/edit`}
                    >
                      Edit
                    </Link>

                    <button
                      className="danger-button"
                      onClick={() => remove(business._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="enquiries-panel">
                    <div className="enquiries-heading">
                      <h3>Enquiries</h3>

                      <span>{businessEnquiries.length}</span>
                    </div>

                    {businessEnquiries.length === 0 ? (
                      <p className="page-copy">
                        No enquiries yet.
                      </p>
                    ) : (
                      <div className="enquiry-list">
                        {businessEnquiries.map((enquiry) => (
                          <div
                            className="enquiry-item"
                            key={enquiry._id}
                          >
                            <div className="enquiry-item-header">
                              <div>
                                <strong>{enquiry.name}</strong>

                                <p>
                                  {enquiry.email}
                                  {enquiry.phone
                                    ? ` · ${enquiry.phone}`
                                    : ''}
                                </p>
                              </div>

                              <span
                                className={`status status-${enquiry.status}`}
                              >
                                {enquiry.status}
                              </span>
                            </div>

                            <p className="enquiry-message">
                              {enquiry.message}
                            </p>

                            {enquiry.reply && (
                              <div className="enquiry-reply">
                                <strong>Your reply</strong>

                                <p>{enquiry.reply}</p>
                              </div>
                            )}

                            <div className="reply-form">
                              <textarea
                                value={replyText[enquiry._id] || ''}
                                onChange={(event) =>
                                  changeReply(
                                    enquiry._id,
                                    event.target.value,
                                  )
                                }
                                maxLength={1000}
                                rows={3}
                                placeholder={
                                  enquiry.reply
                                    ? 'Update your reply...'
                                    : 'Write a reply to the customer...'
                                }
                              />

                              <button
                                type="button"
                                disabled={
                                  replyingId === enquiry._id
                                }
                                onClick={() =>
                                  sendReply(enquiry._id)
                                }
                              >
                                {replyingId === enquiry._id
                                  ? 'Sending…'
                                  : enquiry.reply
                                    ? 'Update Reply'
                                    : 'Send Reply'}
                              </button>
                            </div>

                            <div className="enquiry-actions">
                              {enquiry.status !== 'new' && (
                                <button
                                  type="button"
                                  disabled={
                                    updatingId === enquiry._id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      enquiry._id,
                                      'new',
                                    )
                                  }
                                >
                                  Mark as New
                                </button>
                              )}

                              {enquiry.status !== 'read' && (
                                <button
                                  type="button"
                                  disabled={
                                    updatingId === enquiry._id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      enquiry._id,
                                      'read',
                                    )
                                  }
                                >
                                  Mark as Read
                                </button>
                              )}

                              {enquiry.status !== 'resolved' && (
                                <button
                                  type="button"
                                  disabled={
                                    updatingId === enquiry._id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      enquiry._id,
                                      'resolved',
                                    )
                                  }
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}