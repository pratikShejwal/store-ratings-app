import { Router } from 'express';
import { getStoreOwnerDashboard } from '../controllers/storeOwnerController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth, requireRole('store_owner'));

router.get('/dashboard', getStoreOwnerDashboard);

export default router;
