import { z } from 'zod';

const nameSchema = z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters');
const addressSchema = z.string().min(1, 'Address is required').max(400, 'Address must be at most 400 characters');
const passwordSchema = z
  .string()
  .min(8, 'Password must be 8-16 characters')
  .max(16, 'Password must be 8-16 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'`~]/, 'Include at least one special character');
const emailSchema = z.string().email('Invalid email address');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

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
  ownerId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : Number(v))),
});
