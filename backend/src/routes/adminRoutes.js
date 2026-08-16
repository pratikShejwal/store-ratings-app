import { Router } from 'express';
import {
  getDashboardStats,
  createUser,
  listUsers,
  getUserDetails,
  createStore,
  listStores,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { adminCreateUserSchema, createStoreSchema } from '../utils/validators.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', getDashboardStats);

router.post('/users', validate(adminCreateUserSchema), createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);

router.post('/stores', validate(createStoreSchema), createStore);
router.get('/stores', listStores);

export default router;
