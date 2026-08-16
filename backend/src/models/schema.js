import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------- Enums ----------
export const roleEnum = pgEnum('role', ['admin', 'user', 'store_owner']);

// ---------- Users ----------
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  address: varchar('address', { length: 400 }).notNull(),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ---------- Stores ----------
export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  address: varchar('address', { length: 400 }).notNull(),
  // The store_owner user who owns/manages this store (nullable in case store
  // is created before an owner account, though normally set together)
  ownerId: integer('owner_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ---------- Ratings ----------
export const ratings = pgTable(
  'ratings',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(), // 1 to 5, enforced at app + DB check level
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    // one rating per user per store
    userStoreUnique: uniqueIndex('ratings_user_store_unique').on(
      table.userId,
      table.storeId
    ),
  })
);

// ---------- Relations (for query API convenience) ----------
export const usersRelations = relations(users, ({ many, one }) => ({
  ratings: many(ratings),
  ownedStore: one(stores, {
    fields: [users.id],
    references: [stores.ownerId],
  }),
}));

export const storesRelations = relations(stores, ({ many, one }) => ({
  ratings: many(ratings),
  owner: one(users, {
    fields: [stores.ownerId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [ratings.storeId],
    references: [stores.id],
  }),
}));
