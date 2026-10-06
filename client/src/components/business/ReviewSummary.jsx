import React from 'react';
export default function ReviewSummary({ summary }) {
  const hasReviews = summary?.reviewCount > 0;
  return <div className="review-summary"><div className="review-score">★<strong>{hasReviews ? summary.averageRating.toFixed(1) : '—'}</strong></div><div><p className="review-title">{hasReviews ? `${summary.reviewCount} ${summary.reviewCount === 1 ? 'review' : 'reviews'}` : 'No ratings yet'}</p><p className="detail-copy">{hasReviews ? 'Ratings are based on LocalFind customer reviews.' : 'Be the first customer to share your experience.'}</p></div></div>;
}
