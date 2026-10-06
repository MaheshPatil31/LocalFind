import React from 'react';
import { useEffect, useState } from 'react';
import { enquiryApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyEnquiriesPage() {
  const { token } = useAuth();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEnquiries() {
      setLoading(true);
      setError('');

      try {
        const { enquiries: items } = await enquiryApi.mine(token);
        setEnquiries(items);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadEnquiries();
  }, [token]);

  return (
    <section className="container owner-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Customer</p>
          <h1>My enquiries</h1>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading enquiries…</p>
      ) : enquiries.length === 0 ? (
        <p className="page-copy">
          You have not sent any enquiries yet.
        </p>
      ) : (
        <div className="enquiry-list">
          {enquiries.map((enquiry) => (
            <article className="enquiry-item" key={enquiry._id}>
              <div className="enquiry-item-header">
                <div>
                  <strong>
                    {enquiry.business?.name || 'Business'}
                  </strong>

                  <p>
                    {enquiry.business?.category || ''}
                    {enquiry.business?.area
                      ? ` · ${enquiry.business.area}`
                      : ''}
                  </p>
                </div>

                <span
                  className={`status status-${enquiry.status}`}
                >
                  {enquiry.status}
                </span>
              </div>

              <div>
                <strong>Your message</strong>

                <p className="enquiry-message">
                  {enquiry.message}
                </p>
              </div>

              {enquiry.reply ? (
                <div className="enquiry-reply">
                  <strong>Business reply</strong>

                  <p>{enquiry.reply}</p>
                </div>
              ) : (
                <p className="page-copy">
                  The business has not replied yet.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}