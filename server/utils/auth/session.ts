import { Buffer } from 'node:buffer'
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'

import { sha256 } from '@oslojs/crypto/sha2'
import { eq } from 'drizzle-orm'
import { deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

import { useDb } from '../../db'
import { sessions, users } from '../../db/schema'
import type { AuthSession, AuthUser } from './types'

const encoder = new TextEncoder()

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

function hashSecret(secret: string) {
  return bytesToHex(sha256(encoder.encode(secret)))
}

function createSessionToken() {
  const sessionId = randomUUID()
  const secret = randomBytes(32).toString('base64url')
  return {
    sessionId,
    secret,
    token: `${sessionId}.${secret}`
  }
}

function shouldRefreshExpiration(expiresAt: Date, maxAgeMs: number) {
  const now = Date.now()
  const timeLeft = expiresAt.getTime() - now
  return timeLeft <= maxAgeMs / 2
}

function serializeUser(record: { id: string, email: string, displayName: string | null, createdAt: Date }) {
  const { id, email, displayName, createdAt } = record
  return {
    id,
    email,
    displayName,
    createdAt: createdAt.toISOString()
  } satisfies AuthUser
}

function serializeSession(record: { id: string, userId: string, createdAt: Date, expiresAt: Date }) {
  return {
    id: record.id,
    userId: record.userId,
    createdAt: record.createdAt.toISOString(),
    expiresAt: record.expiresAt.toISOString()
  } satisfies AuthSession
}

export function getSessionCookie(event: H3Event) {
  const runtimeConfig = useRuntimeConfig(event)
  const cookieName = (runtimeConfig.session?.cookieName as string | undefined) || 'pos_session'
  return {
    name: cookieName,
    value: getCookie(event, cookieName) ?? null,
    config: runtimeConfig.session ?? {}
  }
}

export function setSessionCookie(event: H3Event, token: string, expiresAt: Date) {
  const runtimeConfig = useRuntimeConfig(event)
  const sessionConfig = runtimeConfig.session ?? {}
  const cookieName = (sessionConfig.cookieName as string | undefined) || 'pos_session'
  const maxAge = Number(sessionConfig.maxAge ?? 60 * 60 * 24 * 30)

  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
    maxAge,
    domain: typeof sessionConfig.cookieDomain === 'string' && sessionConfig.cookieDomain.length > 0
      ? sessionConfig.cookieDomain
      : undefined
  })
}

export function deleteSessionCookie(event: H3Event) {
  const runtimeConfig = useRuntimeConfig(event)
  const sessionConfig = runtimeConfig.session ?? {}
  const cookieName = (sessionConfig.cookieName as string | undefined) || 'pos_session'

  deleteCookie(event, cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: typeof sessionConfig.cookieDomain === 'string' && sessionConfig.cookieDomain.length > 0
      ? sessionConfig.cookieDomain
      : undefined
  })
}

export async function createSession(event: H3Event, userId: string) {
  const db = useDb(event)
  const runtimeConfig = useRuntimeConfig(event)
  const sessionConfig = runtimeConfig.session ?? {}
  const maxAgeSeconds = Number(sessionConfig.maxAge ?? 60 * 60 * 24 * 30)
  const maxAgeMs = maxAgeSeconds * 1000

  const tokenParts = createSessionToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + maxAgeMs)
  const secretHash = hashSecret(tokenParts.secret)

  await db.insert(sessions).values({
    id: tokenParts.sessionId,
    userId,
    secretHash,
    createdAt: now,
    expiresAt
  })

  setSessionCookie(event, tokenParts.token, expiresAt)

  return {
    token: tokenParts.token,
    session: serializeSession({
      id: tokenParts.sessionId,
      userId,
      createdAt: now,
      expiresAt
    })
  }
}

export async function validateSessionToken(event: H3Event, token: string) {
  const [sessionId, secret] = token.split('.')
  if (!sessionId || !secret) {
    return { session: null, user: null }
  }

  const db = useDb(event)
  const runtimeConfig = useRuntimeConfig(event)
  const sessionConfig = runtimeConfig.session ?? {}
  const maxAgeSeconds = Number(sessionConfig.maxAge ?? 60 * 60 * 24 * 30)
  const maxAgeMs = maxAgeSeconds * 1000

  const sessionRecord = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId)
  })

  if (!sessionRecord) {
    return { session: null, user: null }
  }

  const now = new Date()
  if (sessionRecord.expiresAt.getTime() <= now.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, sessionRecord.id))
    return { session: null, user: null }
  }

  const expectedHash = hashSecret(secret)
  const storedHashBuffer = Buffer.from(sessionRecord.secretHash, 'hex')
  const expectedHashBuffer = Buffer.from(expectedHash, 'hex')

  if (storedHashBuffer.byteLength !== expectedHashBuffer.byteLength || !timingSafeEqual(storedHashBuffer, expectedHashBuffer)) {
    return { session: null, user: null }
  }

  if (shouldRefreshExpiration(sessionRecord.expiresAt, maxAgeMs)) {
    const newExpiresAt = new Date(now.getTime() + maxAgeMs)
    await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, sessionRecord.id))
    sessionRecord.expiresAt = newExpiresAt
    setSessionCookie(event, token, newExpiresAt)
  }

  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, sessionRecord.userId)
  })

  if (!userRecord) {
    await db.delete(sessions).where(eq(sessions.id, sessionRecord.id))
    return { session: null, user: null }
  }

  return {
    session: serializeSession(sessionRecord),
    user: serializeUser(userRecord)
  }
}

export async function invalidateSession(event: H3Event, sessionId: string) {
  const db = useDb(event)
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export async function invalidateAllSessions(event: H3Event, userId: string) {
  const db = useDb(event)
  await db.delete(sessions).where(eq(sessions.userId, userId))
}
