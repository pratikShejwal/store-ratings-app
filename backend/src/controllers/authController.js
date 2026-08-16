import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users } from '../models/schema.js';
import { signToken, COOKIE_NAME, cookieOptions } from '../utils/jwt.js';

// POST /api/auth/signup  (Normal User self-registration only)
export async function signup(req, res, next) {
  try {
    const { name, email, address, password } = req.body;

    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, address, password: hashedPassword, role: 'user' })
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

    const token = signToken({ id: newUser.id, role: newUser.role, email: newUser.email });
    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.status(200).json({ message: 'Logged out successfully' });
}

// GET /api/auth/me
export async function getCurrentUser(req, res, next) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user.id),
      columns: { id: true, name: true, email: true, address: true, role: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/auth/update-password
export async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await db.query.users.findFirst({ where: eq(users.id, req.user.id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, user.id));

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}
