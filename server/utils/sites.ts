import { randomBytes, randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

import type { Database } from '../db'
import { sites } from '../db/schema'
import type { Site } from '../../types/site'

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function formatDate(value: Date) {
  return value.toISOString()
}

export type DBSite = InferSelectModel<typeof sites>

export function serializeSite(record: DBSite): Site {
  return {
    id: record.id,
    ownerId: record.ownerId,
    name: record.name,
    address: record.address,
    status: record.status,
    referenceCode: record.referenceCode,
    captureToken: record.captureToken,
    createdAt: formatDate(record.createdAt),
    updatedAt: formatDate(record.updatedAt)
  }
}

function generateReferenceCode(length = 6) {
  const bytes = randomBytes(length)
  let result = ''

  for (let i = 0; i < length; i += 1) {
    const index = bytes[i] % REFERENCE_ALPHABET.length
    result += REFERENCE_ALPHABET[index]
  }

  return result
}

async function referenceCodeExists(db: Database, code: string) {
  const existing = await db.query.sites.findFirst({
    where: eq(sites.referenceCode, code)
  })

  return Boolean(existing)
}

export async function createUniqueReferenceCode(db: Database, maxRetries = 10) {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    const candidate = generateReferenceCode()
    const exists = await referenceCodeExists(db, candidate)

    if (!exists) {
      return candidate
    }
  }

  throw new Error('Unable to allocate a unique reference code')
}

export function createCaptureToken() {
  return randomUUID()
}

