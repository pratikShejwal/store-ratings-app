import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { stores, ratings } from '../models/schema.js';

// GET /api/stores?name=&address=  (Normal user view: includes overall + own rating)
export async function listStoresForUser(req, res, next) {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    const conditions = [];
    if (name) conditions.push(ilike(stores.name, `%${name}%`));
    if (address) conditions.push(ilike(stores.address, `%${address}%`));

    const results = await db
      .select({
        id: stores.id,
        name: stores.name,
        address: stores.address,
        overallRating: sql`COALESCE(AVG(${ratings.value}), 0)::float`,
        userRating: sql`MAX(CASE WHEN ${ratings.userId} = ${userId} THEN ${ratings.value} END)::int`,
      })
      .from(stores)
      .leftJoin(ratings, eq(ratings.storeId, stores.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .groupBy(stores.id)
      .orderBy(stores.name);

    res.status(200).json({ stores: results });
  } catch (err) {
    next(err);
  }
}

// POST /api/stores/ratings  - Submit or update a rating (upsert)
export async function submitRating(req, res, next) {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id;

    const store = await db.query.stores.findFirst({ where: eq(stores.id, storeId) });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existing = await db.query.ratings.findFirst({
      where: and(eq(ratings.userId, userId), eq(ratings.storeId, storeId)),
    });

    let result;
    if (existing) {
      [result] = await db
        .update(ratings)
        .set({ value, updatedAt: new Date() })
        .where(eq(ratings.id, existing.id))
        .returning();
    } else {
      [result] = await db.insert(ratings).values({ userId, storeId, value }).returning();
    }

    res.status(200).json({ rating: result });
  } catch (err) {
    next(err);
  }
}
