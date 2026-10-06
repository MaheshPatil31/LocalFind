import { Router } from 'express';
import { createReview, deleteOwnReview, getBusinessReviews, updateOwnReview } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const businessReviewRouter = Router();
businessReviewRouter.get('/:businessId/reviews', getBusinessReviews);
businessReviewRouter.post('/:businessId/reviews', authenticate, authorize('customer'), createReview);

const reviewRouter = Router();
reviewRouter.patch('/:reviewId', authenticate, authorize('customer'), updateOwnReview);
reviewRouter.delete('/:reviewId', authenticate, authorize('customer'), deleteOwnReview);

export { businessReviewRouter, reviewRouter };
