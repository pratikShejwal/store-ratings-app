import { z } from 'zod';

// Name: Min 20 characters, Max 60 characters.
const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

// Address: Max 400 characters.
const addressSchema = z
  .string()
  .min(1, 'Address is required')
  .max(400, 'Address must be at most 400 characters');

// Password: 8-16 characters, at least one uppercase letter and one special character.
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'`~]/, 'Password must include at least one special character');

const emailSchema = z.string().email('Invalid email address');

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// Admin creating a user (normal user or admin) - includes role
export const adminCreateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(['admin', 'user', 'store_owner']),
});

export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.number().int().positive().optional().nullable(),
});

export const submitRatingSchema = z.object({
  storeId: z.number().int().positive(),
  value: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
});
