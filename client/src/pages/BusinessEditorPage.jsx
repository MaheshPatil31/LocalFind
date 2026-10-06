import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import BusinessForm from '../components/business/BusinessForm.jsx';
import BusinessImageManager from '../components/business/BusinessImageManager.jsx';

import { useAuth } from '../context/AuthContext.jsx';
import { businessApi } from '../services/api.js';

export default function BusinessEditorPage({ editing = false }) {
  const { token } = useAuth();
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editing) {
      return;
    }

    businessApi
      .get(token, businessId)
      .then(({ business: item }) => {
        setBusiness(item);
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  }, [editing, token, businessId]);

  async function submit(values) {
    setSubmitting(true);
    setError('');

    try {
      if (editing) {
        const result = await businessApi.update(
          token,
          businessId,
          values,
        );

        setBusiness(result.business);
      } else {
        const result = await businessApi.create(
          token,
          values,
        );

        setBusiness(result.business);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleImagesChange(images) {
    setBusiness((current) => ({
      ...current,
      images,
    }));
  }

  if (editing && !business && !error) {
    return (
      <section className="container owner-page">
        <div className="editor-loading">
          <p className="eyebrow">Business owner</p>

          <h1>Loading business...</h1>

          <p className="page-copy">
            Please wait while we load your business information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container owner-page">
      <div className="editor-header">
        <div>
          <p className="eyebrow">Business owner</p>

          <h1>
            {editing
              ? 'Edit your business'
              : 'Add your business'}
          </h1>

          <p className="page-copy">
            {editing
              ? 'Keep your business information accurate and up to date.'
              : 'Add your business details so customers can discover your services on LocalFind.'}
          </p>
        </div>

        <Link
          className="editor-back-link"
          to="/owner/businesses"
        >
          ← Back to my businesses
        </Link>
      </div>

      {error && (
        <p className="form-error editor-error">
          {error}
        </p>
      )}

      {(!editing || business) && (
        <>
          <BusinessForm
            initialBusiness={business}
            onSubmit={submit}
            submitting={submitting}
          />

          {business && (
            <BusinessImageManager
              businessId={business._id}
              images={business.images || []}
              onImagesChange={handleImagesChange}
            />
          )}
        </>
      )}
    </section>
  );
}