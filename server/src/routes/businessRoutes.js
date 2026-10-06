import { Router } from 'express';

import {
  createBusiness,
  deleteBusinessImage,
  deleteMyBusiness,
  getAllBusinessesForAdmin,
  getApprovedBusiness,
  getApprovedBusinesses,
  getNearbyBusinesses,
  getMyBusiness,
  getMyBusinesses,
  updateBusinessStatus,
  updateMyBusiness,
  uploadBusinessImages,
} from '../controllers/businessController.js';

import { authenticate } from '../middleware/authenticate.js';

import { authorize } from '../middleware/authorize.js';

import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getApprovedBusinesses);

const ownerOnly = [
  authenticate,
  authorize('businessOwner'),
];

const adminOnly = [
  authenticate,
  authorize('admin'),
];

router.post('/', ...ownerOnly, createBusiness);

router.get('/mine', ...ownerOnly, getMyBusinesses);

router.get(
  '/mine/:businessId',
  ...ownerOnly,
  getMyBusiness,
);

router.patch(
  '/mine/:businessId',
  ...ownerOnly,
  updateMyBusiness,
);

router.delete(
  '/mine/:businessId',
  ...ownerOnly,
  deleteMyBusiness,
);

// Business image upload
router.post(
  '/mine/:businessId/images',
  ...ownerOnly,
  upload.array('images', 6),
  uploadBusinessImages,
);

// Business image deletion
router.delete(
  '/mine/:businessId/images',
  ...ownerOnly,
  deleteBusinessImage,
);

// Nearby businesses
// IMPORTANT: this must come before /:businessId
router.get('/nearby', getNearbyBusinesses);

// Admin routes

router.get(
  '/admin/all',
  ...adminOnly,
  getAllBusinessesForAdmin,
);

router.patch(
  '/admin/:businessId/status',
  ...adminOnly,
  updateBusinessStatus,
);

// Public business detail route
router.get('/:businessId', getApprovedBusiness);

export default router;