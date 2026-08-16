import bcrypt from 'bcryptjs';
import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users, stores, ratings } from '../models/schema.js';

const SORTABLE_USER_FIELDS = { name: users.name, email: users.email, address: users.address, role: users.role };
const SORTABLE_STORE_FIELDS = { name: stores.name, email: stores.email, address: stores.address };

function getSortColumn(map, field, fallback) {
  return map[field] || fallback;
}

// GET /api/admin/dashboard
export async function getDashboardStats(req, res, next) {
  try {
    const [[{ count: userCount }], [{ count: storeCount }], [{ count: ratingCount }]] = await Promise.all([
      db.select({ count: sql`count(*)::int` }).from(users),
      db.select({ count: sql`count(*)::int` }).from(stores),
      db.select({ count: sql`count(*)::int` }).from(ratings),
    ]);

    res.status(200).json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users  - Add a normal user or admin user
export async function createUser(req, res, next) {
  try {
    const { name, email, address, password, role } = req.body;

    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, address, password: hashedPassword, role })
      .returning({ id: users.id, name: users.name, email: users.email, address: users.address, role: users.role });

    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&sortOrder=
export async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const conditions = [];
    if (name) conditions.push(ilike(users.name, `%${name}%`));
    if (email) conditions.push(ilike(users.email, `%${email}%`));
    if (address) conditions.push(ilike(users.address, `%${address}%`));
    if (role) conditions.push(eq(users.role, role));

    const sortCol = getSortColumn(SORTABLE_USER_FIELDS, sortBy, users.name);
    const orderFn = sortOrder === 'desc' ? desc : asc;

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        address: users.address,
        role: users.role,
      })
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderFn(sortCol));

    res.status(200).json({ users: results });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id - includes store rating if role is store_owner
export async function getUserDetails(req, res, next) {
  try {
    const { id } = req.params;

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(id)),
      columns: { id: true, name: true, email: true, address: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let storeRating = null;
    if (user.role === 'store_owner') {
      const ownedStore = await db.query.stores.findFirst({ where: eq(stores.ownerId, user.id) });
      if (ownedStore) {
        const [avg] = await db
          .select({ avgRating: sql`COALESCE(AVG(${ratings.value}), 0)::float` })
          .from(ratings)
          .where(eq(ratings.storeId, ownedStore.id));
        storeRating = avg.avgRating;
      }
    }

    res.status(200).json({ user: { ...user, rating: storeRating } });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/stores - Add a new store
export async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (ownerId) {
      const owner = await db.query.users.findFirst({ where: eq(users.id, ownerId) });
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'ownerId must reference an existing user with role store_owner' });
      }
    }

    const [newStore] = await db.insert(stores).values({ name, email, address, ownerId: ownerId || null }).returning();

    res.status(201).json({ store: newStore });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores?name=&email=&address=&sortBy=&sortOrder=
export async function listStores(req, res, next) {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const conditions = [];
    if (name) conditions.push(ilike(stores.name, `%${name}%`));
    if (email) conditions.push(ilike(stores.email, `%${email}%`));
    if (address) conditions.push(ilike(stores.address, `%${address}%`));

    const sortCol = getSortColumn(SORTABLE_STORE_FIELDS, sortBy, stores.name);
    const orderFn = sortOrder === 'desc' ? desc : asc;

    const results = await db
      .select({
        id: stores.id,
        name: stores.name,
        email: stores.email,
        address: stores.address,
        avgRating: sql`COALESCE(AVG(${ratings.value}), 0)::float`,
      })
      .from(stores)
      .leftJoin(ratings, eq(ratings.storeId, stores.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .groupBy(stores.id)
      .orderBy(orderFn(sortCol));

    res.status(200).json({ stores: results });
  } catch (err) {
    next(err);
  }
}
