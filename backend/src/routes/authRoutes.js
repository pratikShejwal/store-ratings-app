import { Router } from 'express';
import { signup, login, logout, getCurrentUser, updatePassword } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { signupSchema, loginSchema, updatePasswordSchema } from '../utils/validators.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, getCurrentUser);
router.put('/update-password', requireAuth, validate(updatePasswordSchema), updatePassword);

export default router;
