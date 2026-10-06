import React from 'react';
import { Link } from 'react-router-dom';

export default function BusinessCard({ business }) {
  const firstImage = business.images?.[0]?.url;

  return (
    <article className="public-business-card">
      {firstImage ? (
        <img
          src={firstImage}
          alt={business.name}
          className="business-image"
        />
      ) : (
        <div
          className="business-image business-image-placeholder"
          aria-hidden="true"
        >
          LF
        </div>
      )}

      <div className="business-card-content">
        <p className="eyebrow">{business.category}</p>

        <h2>{business.name}</h2>

        <p className="business-description">
          {business.description ||
            'A local business serving Hyderabad.'}
        </p>

        <p className="business-meta">
          ★{' '}
          {business.reviewCount
            ? `${business.averageRating.toFixed(
                1,
              )} (${business.reviewCount})`
            : 'No ratings yet'}{' '}
          · {business.area}, {business.city}
        </p>

        <p className="business-contact">
          {business.phone}
          {business.email &&
            ` · ${business.email}`}
        </p>

        <Link
          className="text-link"
          to={`/businesses/${business._id}`}
        >
          View details →
        </Link>
      </div>
    </article>
  );
}