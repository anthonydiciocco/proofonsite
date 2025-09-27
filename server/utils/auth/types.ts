import type { InferSelectModel } from 'drizzle-orm'

import type { sessions, users } from '../../db/schema'

export type DBUser = InferSelectModel<typeof users>
export type DBSession = InferSelectModel<typeof sessions>

export interface AuthUser {
  id: string
  email: string
  displayName: string | null
  createdAt: string
}

export interface AuthSession {
  id: string
  userId: string
  createdAt: string
  expiresAt: string
}

export interface AuthContext {
  user: AuthUser | null
  session: AuthSession | null
}
