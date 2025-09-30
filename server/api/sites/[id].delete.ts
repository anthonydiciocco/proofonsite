import { and, eq } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'

import { useDb } from '../../db'
import { sites } from '../../db/schema'
import { requireAuthUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const siteId = getRouterParam(event, 'id')

  if (!siteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Site id is required'
    })
  }

  const db = useDb(event)

  const [record] = await db.delete(sites).where(and(
    eq(sites.id, siteId),
    eq(sites.ownerId, user.id)
  )).returning()

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Site not found'
    })
  }

  return {
    success: true
  }
})
