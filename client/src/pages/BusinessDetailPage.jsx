import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  businessApi,
  reviewApi,
  enquiryApi,
} from '../services/api.js';
import ProfileSection from '../components/business/ProfileSection.jsx';
import BusinessInformation from '../components/business/BusinessInformation.jsx';
import ServiceList from '../components/business/ServiceList.jsx';
import BusinessActions from '../components/business/BusinessActions.jsx';
import ReviewSummary from '../components/business/ReviewSummary.jsx';
import ReviewForm from '../components/business/ReviewForm.jsx';
import ReviewList from '../components/business/ReviewList.jsx';
import BusinessMap from '../components/business/BusinessMap.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function BusinessDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [business, setBusiness] = useState(null);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    businessApi
      .public(id)
      .then(({ business: item }) => setBusiness(item))
      .catch((requestError) =>
        setError(requestError.message),
      );
  }, [id]);

  useEffect(() => {
    if (user?.role === 'customer') {
      setEnquiryForm({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        message: '',
      });
    }
  }, [user]);

  function loadReviews() {
    reviewApi
      .list(id)
      .then(({ reviews: items, summary: stats }) => {
        setReviews(items);
        setSummary(stats);
      })
      .catch((requestError) =>
        setReviewError(requestError.message),
      );
  }

  useEffect(loadReviews, [id]);

  async function saveReview(values) {
    setSubmitting(true);
    setReviewError('');

    try {
      if (editingReview) {
        await reviewApi.update(
          token,
          editingReview._id,
          values,
        );
      } else {
        await reviewApi.create(token, id, values);
      }

      setEditingReview(null);
      loadReviews();

      businessApi
        .public(id)
        .then(({ business: item }) =>
          setBusiness(item),
        );
    } catch (requestError) {
      setReviewError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReview(reviewId) {
    setDeletingId(reviewId);
    setReviewError('');

    try {
      await reviewApi.remove(token, reviewId);

      if (editingReview?._id === reviewId) {
        setEditingReview(null);
      }

      loadReviews();

      businessApi
        .public(id)
        .then(({ business: item }) =>
          setBusiness(item),
        );
    } catch (requestError) {
      setReviewError(requestError.message);
    } finally {
      setDeletingId('');
    }
  }

  function handleEnquiryChange(event) {
    const { name, value } = event.target;

    setEnquiryForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitEnquiry(event) {
    event.preventDefault();

    setEnquirySubmitting(true);
    setEnquiryError('');
    setEnquirySuccess(false);

    try {
      await enquiryApi.create(
        token,
        id,
        enquiryForm,
      );

      setEnquirySuccess(true);

      setEnquiryForm((current) => ({
        ...current,
        phone: '',
        message: '',
      }));
    } catch (requestError) {
      setEnquiryError(requestError.message);
    } finally {
      setEnquirySubmitting(false);
    }
  }

  if (error) {
    return (
      <section className="container detail-page">
        <p className="form-error">{error}</p>

        <Link
          className="text-link"
          to="/businesses"
        >
          Back to businesses
        </Link>
      </section>
    );
  }

  if (!business) {
    return (
      <section className="container detail-page">
        <p className="state-message">
          Loading business…
        </p>
      </section>
    );
  }

  const address = `${business.address}, ${business.area}, ${business.city} — ${business.pincode}`;

  return (
    <section className="container detail-page">
      <Link
        className="text-link"
        to="/businesses"
      >
        ← All businesses
      </Link>

      <div className="detail-header">
        <div>
          <p className="eyebrow">
            {business.category}
          </p>

          <h1>{business.name}</h1>

          <p className="business-meta">
            ★{' '}
            {business.reviewCount
              ? `${business.averageRating.toFixed(
                  1,
                )} (${business.reviewCount})`
              : 'No ratings yet'}{' '}
            · {business.area}, {business.city}
          </p>

          <BusinessActions business={business} />
        </div>

        {business.images?.[0]?.url && (
          <img
            className="detail-image"
            src={business.images[0].url}
            alt={business.name}
          />
        )}
      </div>

      <div className="profile-layout">
        <div className="profile-main">
          <ProfileSection
            eyebrow="Overview"
            title="About this business"
          >
            <p className="detail-copy">
              {business.description ||
                'Information about this business will be added soon.'}
            </p>
          </ProfileSection>

          <ProfileSection
            eyebrow="What they offer"
            title="Services"
          >
            <ServiceList
              services={business.services}
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="When to visit"
            title="Working hours"
          >
            <p className="detail-copy">
              {business.workingHours ||
                'Contact the business for working hours.'}
            </p>
          </ProfileSection>

          <ProfileSection
            eyebrow="Photos"
            title="Business photos"
          >
            <div className="photo-grid">
              {business.images?.length ? (
                business.images.map(
                  (image, index) => (
                    <img
                      key={image.publicId || index}
                      src={image.url}
                      alt={`${business.name} ${
                        index + 1
                      }`}
                    />
                  ),
                )
              ) : (
                <div className="photo-placeholder">
                  Photos will be added by this
                  business.
                </div>
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            eyebrow="Community"
            title="Ratings & reviews"
          >
            <ReviewSummary summary={summary} />

            {reviewError && (
              <p className="form-error">
                {reviewError}
              </p>
            )}

            <ReviewList
              reviews={reviews}
              currentUserId={user?.id}
              onEdit={setEditingReview}
              onDelete={deleteReview}
              deletingId={deletingId}
            />

            {user?.role === 'customer' ? (
              <div className="review-editor">
                <h3>
                  {editingReview
                    ? 'Edit your review'
                    : 'Write a review'}
                </h3>

                <ReviewForm
                  key={
                    editingReview?._id || 'new'
                  }
                  review={editingReview}
                  onSubmit={saveReview}
                  submitting={submitting}
                />

                {editingReview && (
                  <button
                    className="cancel-review"
                    type="button"
                    onClick={() =>
                      setEditingReview(null)
                    }
                  >
                    Cancel editing
                  </button>
                )}
              </div>
            ) : (
              <p className="review-signin">
                {user ? (
                  'Only customer accounts can leave reviews.'
                ) : (
                  <>
                    <Link to="/login">
                      Log in
                    </Link>{' '}
                    as a customer to write a
                    review.
                  </>
                )}
              </p>
            )}
          </ProfileSection>

          <ProfileSection
            eyebrow="Location"
            title="Find this business"
          >
            <BusinessMap business={business} />

            <p className="map-address">
              {address}
            </p>

            {business.latitude &&
              business.longitude && (
                <a
                  className="map-directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
              )}
          </ProfileSection>
        </div>

        <aside className="profile-sidebar">
          <ProfileSection
            eyebrow="Get in touch"
            title="Contact information"
          >
            <BusinessInformation
              items={[
                {
                  label: 'Phone',
                  value: business.phone,
                  href: `tel:${business.phone}`,
                },

                ...(business.email
                  ? [
                      {
                        label: 'Email',
                        value: business.email,
                        href: `mailto:${business.email}`,
                      },
                    ]
                  : []),

                ...(business.owner?.name
                  ? [
                      {
                        label: 'Listed by',
                        value:
                          business.owner.name,
                      },
                    ]
                  : []),
              ]}
            />
          </ProfileSection>

          <ProfileSection
            eyebrow="Location"
            title="Address"
          >
            <BusinessInformation
              items={[
                {
                  label: 'Business address',
                  value: address,
                },
              ]}
            />
          </ProfileSection>

          <ProfileSection
            id="enquiry"
            className="enquiry-section"
            eyebrow="Need this service?"
            title="Send an enquiry"
          >
            {!user ? (
              <p className="detail-copy">
                <Link to="/login">
                  Log in
                </Link>{' '}
                as a customer to send an
                enquiry to this business.
              </p>
            ) : user.role !== 'customer' ? (
              <p className="detail-copy">
                Only customer accounts can send
                enquiries.
              </p>
            ) : (
              <form onSubmit={submitEnquiry}>
                {enquiryError && (
                  <p className="form-error">
                    {enquiryError}
                  </p>
                )}

                {enquirySuccess && (
                  <p className="form-success">
                    Your enquiry has been sent
                    successfully.
                  </p>
                )}

                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={enquiryForm.name}
                    onChange={handleEnquiryChange}
                    minLength="2"
                    maxLength="80"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={enquiryForm.email}
                    onChange={handleEnquiryChange}
                    maxLength="254"
                    required
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    maxLength="25"
                  />
                </label>

                <label>
                  Message
                  <textarea
                    name="message"
                    value={enquiryForm.message}
                    onChange={handleEnquiryChange}
                    minLength="10"
                    maxLength="1000"
                    rows="5"
                    placeholder="Tell the business what you need..."
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={enquirySubmitting}
                >
                  {enquirySubmitting
                    ? 'Sending…'
                    : 'Send enquiry'}
                </button>
              </form>
            )}
          </ProfileSection>
        </aside>
      </div>
    </section>
  );
}