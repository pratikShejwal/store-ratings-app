import { eq, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { stores, ratings, users } from '../models/schema.js';

// GET /api/store-owner/dashboard
export async function getStoreOwnerDashboard(req, res, next) {
  try {
    const ownerId = req.user.id;

    const store = await db.query.stores.findFirst({ where: eq(stores.ownerId, ownerId) });
    if (!store) {
      return res.status(404).json({ message: 'No store is associated with this account' });
    }

    const raters = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        rating: ratings.value,
        ratedAt: ratings.updatedAt,
      })
      .from(ratings)
      .innerJoin(users, eq(users.id, ratings.userId))
      .where(eq(ratings.storeId, store.id))
      .orderBy(users.name);

    const [avg] = await db
      .select({ avgRating: sql`COALESCE(AVG(${ratings.value}), 0)::float` })
      .from(ratings)
      .where(eq(ratings.storeId, store.id));

    res.status(200).json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avg.avgRating,
      raters,
    });
  } catch (err) {
    next(err);
  }
}
