import { randomUUID } from 'node:crypto'

import { defineEventHandler, readValidatedBody } from 'h3'

import { useDb } from '../../db'
import { sites } from '../../db/schema'
import { requireAuthUser } from '../../utils/auth'
import { createCaptureToken, createUniqueReferenceCode, serializeSite } from '../../utils/sites'
import { sitePayloadSchema } from './validators'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const payload = await readValidatedBody(event, data => sitePayloadSchema.parse(data))

  const db = useDb(event)
  const referenceCode = await createUniqueReferenceCode(db)
  const captureToken = createCaptureToken()
  const now = new Date()

  const [record] = await db.insert(sites).values({
    id: randomUUID(),
    ownerId: user.id,
    name: payload.name,
    address: payload.address,
    contactName: payload.contactName,
    contactPhone: payload.contactPhone,
    notes: payload.notes,
    status: payload.status ?? 'active',
    referenceCode,
    captureToken,
    createdAt: now,
    updatedAt: now
  }).returning()

  return serializeSite(record)
})
