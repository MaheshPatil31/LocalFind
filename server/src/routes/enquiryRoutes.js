import { Router } from 'express';

import {
  createEnquiry,
  getBusinessEnquiries,
  getMyEnquiries,
  updateEnquiryStatus,
  replyToEnquiry,
} from '../controllers/enquiryController.js';

import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.post(
  '/businesses/:businessId/enquiries',
  authenticate,
  authorize('customer'),
  createEnquiry,
);

router.get(
  '/enquiries/mine',
  authenticate,
  authorize('customer'),
  getMyEnquiries,
);

router.get(
  '/businesses/:businessId/enquiries',
  authenticate,
  authorize('businessOwner'),
  getBusinessEnquiries,
);

router.patch(
  '/enquiries/:enquiryId/status',
  authenticate,
  authorize('businessOwner'),
  updateEnquiryStatus,
);
router.patch(
  '/enquiries/:enquiryId/reply',
  authenticate,
  authorize('businessOwner'),
  replyToEnquiry,
);


export default router;