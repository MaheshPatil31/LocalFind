import mongoose from 'mongoose';
import Business from '../models/Business.js';
import Review from '../models/Review.js';

function notFound(message = 'Review not found.') { const error = new Error(message); error.statusCode = 404; return error; }
function invalid(message) { const error = new Error(message); error.statusCode = 400; return error; }

export async function getReviewSummary(businessIds) {
  const stats = await Review.aggregate([{ $match: { business: { $in: businessIds } } }, { $group: { _id: '$business', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }]);
  return new Map(stats.map((stat) => [stat._id.toString(), { averageRating: Number(stat.averageRating.toFixed(1)), reviewCount: stat.reviewCount }]));
}

export async function getBusinessReviews(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) throw notFound('Business not found.');
    const business = await Business.exists({ _id: request.params.businessId, status: 'approved' });
    if (!business) throw notFound('Business not found.');
    const [reviews, summary] = await Promise.all([
      Review.find({ business: request.params.businessId }).populate('user', 'name').sort({ createdAt: -1 }),
      getReviewSummary([new mongoose.Types.ObjectId(request.params.businessId)]),
    ]);
    response.json({ reviews, summary: summary.get(request.params.businessId) || { averageRating: null, reviewCount: 0 } });
  } catch (error) { next(error); }
}

export async function createReview(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) throw notFound('Business not found.');
    const { rating, comment } = request.body;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw invalid('Rating must be a whole number between 1 and 5.');
    if (typeof comment !== 'string' || comment.trim().length < 10 || comment.trim().length > 1000) throw invalid('Comment must be between 10 and 1000 characters.');
    const business = await Business.exists({ _id: request.params.businessId, status: 'approved' });
    if (!business) throw notFound('Business not found.');
    const review = await Review.create({ user: request.user._id, business: request.params.businessId, rating, comment: comment.trim() });
    await review.populate('user', 'name');
    const summary = await getReviewSummary([review.business]);
    response.status(201).json({ review, summary: summary.get(review.business.toString()) });
  } catch (error) {
    if (error.code === 11000) return next(invalid('You have already reviewed this business. Edit your existing review instead.'));
    return next(error);
  }
}

export async function updateOwnReview(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.reviewId)) throw notFound();
    const updates = {};
    if (request.body.rating !== undefined) {
      if (!Number.isInteger(request.body.rating) || request.body.rating < 1 || request.body.rating > 5) throw invalid('Rating must be a whole number between 1 and 5.');
      updates.rating = request.body.rating;
    }
    if (request.body.comment !== undefined) {
      if (typeof request.body.comment !== 'string' || request.body.comment.trim().length < 10 || request.body.comment.trim().length > 1000) throw invalid('Comment must be between 10 and 1000 characters.');
      updates.comment = request.body.comment.trim();
    }
    if (!Object.keys(updates).length) throw invalid('Provide a rating or comment to update.');
    const review = await Review.findOneAndUpdate({ _id: request.params.reviewId, user: request.user._id }, { $set: updates }, { new: true, runValidators: true }).populate('user', 'name');
    if (!review) throw notFound();
    const summary = await getReviewSummary([review.business]);
    response.json({ review, summary: summary.get(review.business.toString()) });
  } catch (error) { next(error); }
}

export async function deleteOwnReview(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.reviewId)) throw notFound();
    const review = await Review.findOneAndDelete({ _id: request.params.reviewId, user: request.user._id });
    if (!review) throw notFound();
    const summary = await getReviewSummary([review.business]);
    response.status(200).json({ summary: summary.get(review.business.toString()) || { averageRating: null, reviewCount: 0 } });
  } catch (error) { next(error); }
}
