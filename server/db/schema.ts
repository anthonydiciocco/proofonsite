import { relations } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),

  // Beta tracking
  joinedDuringBeta: boolean('joined_during_beta').default(true),
  betaJoinedAt: timestamp('beta_joined_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, table => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email)
}))

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  secretHash: text('secret_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
})

export const siteStatus = pgEnum('site_status', ['active', 'archived'])

export const sites = pgTable('sites', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  status: siteStatus('status').notNull().default('active'),
  referenceCode: text('reference_code').notNull(),
  captureToken: text('capture_token').notNull(),
  notificationEmails: text('notification_emails').array().default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, table => ({
  referenceCodeIdx: uniqueIndex('sites_reference_code_idx').on(table.referenceCode),
  captureTokenIdx: uniqueIndex('sites_capture_token_idx').on(table.captureToken),
  ownerNameIdx: uniqueIndex('sites_owner_name_idx').on(table.ownerId, table.name)
}))

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  sites: many(sites)
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))

export const sitesRelations = relations(sites, ({ one, many }) => ({
  owner: one(users, {
    fields: [sites.ownerId],
    references: [users.id]
  }),
  deliveries: many(deliveries)
}))

export const deliveries = pgTable('deliveries', {
  id: text('id').primaryKey(),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  photoUrl: text('photo_url').notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  metadata: text('metadata') // JSON string for flexible metadata storage
})

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  site: one(sites, {
    fields: [deliveries.siteId],
    references: [sites.id]
  })
}))
