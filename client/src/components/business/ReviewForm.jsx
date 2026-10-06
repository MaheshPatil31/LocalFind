import React from 'react';
import { useState } from 'react';

export default function ReviewForm({ review, onSubmit, submitting }) {
  const [rating, setRating] = useState(review?.rating || 0); const [comment, setComment] = useState(review?.comment || '');
  function submit(event) { event.preventDefault(); onSubmit({ rating, comment }); }
  return <form className="review-form" onSubmit={submit}><fieldset><legend>Your rating</legend><div className="star-input">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= rating ? 'star-selected' : ''} onClick={() => setRating(star)} aria-label={`${star} star${star > 1 ? 's' : ''}`}>★</button>)}</div></fieldset><label>Your review<textarea value={comment} onChange={(event) => setComment(event.target.value)} minLength="10" maxLength="1000" required placeholder="Share your experience (at least 10 characters)" rows="4" /></label><button disabled={submitting || !rating}>{submitting ? 'Saving…' : review ? 'Update review' : 'Post review'}</button></form>;
}
