import { and, eq } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam, readValidatedBody } from 'h3'

import { useDb } from '../../db'
import { sites } from '../../db/schema'
import { requireAuthUser } from '../../utils/auth'
import { serializeSite } from '../../utils/sites'
import { sitePayloadSchema } from './validators'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const siteId = getRouterParam(event, 'id')

  if (!siteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Site id is required'
    })
  }

  const payload = await readValidatedBody(event, data => sitePayloadSchema.parse(data))

  const db = useDb(event)

  const [record] = await db.update(sites).set({
    name: payload.name,
    address: payload.address,
    status: payload.status ?? 'active',
    updatedAt: new Date()
  }).where(and(
    eq(sites.id, siteId),
    eq(sites.ownerId, user.id)
  )).returning()

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Site not found'
    })
  }

  return serializeSite(record)
})
