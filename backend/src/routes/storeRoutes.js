import { Router } from 'express';
import { listStoresForUser, submitRating } from '../controllers/storeController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { submitRatingSchema } from '../utils/validators.js';

const router = Router();

router.use(requireAuth, requireRole('user'));

router.get('/', listStoresForUser);
router.post('/ratings', validate(submitRatingSchema), submitRating);

export default router;
