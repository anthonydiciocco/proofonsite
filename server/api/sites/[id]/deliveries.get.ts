import { and, desc, eq } from 'drizzle-orm'
import { useDb } from '../../../db'
import { deliveries, sites } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth/guard'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const db = useDb(event)
  const siteId = getRouterParam(event, 'id')

  if (!siteId) {
    throw createError({
      statusCode: 400,
      message: 'Site ID is required'
    })
  }

  // Verify site ownership
  const site = await db.query.sites.findFirst({
    where: and(
      eq(sites.id, siteId),
      eq(sites.ownerId, user.id)
    )
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      message: 'Site not found'
    })
  }

  // Fetch deliveries for this site
  const siteDeliveries = await db.query.deliveries.findMany({
    where: eq(deliveries.siteId, siteId),
    orderBy: [desc(deliveries.capturedAt)],
    limit: 100 // Pagination can be added later
  })

  return {
    deliveries: siteDeliveries.map(d => ({
      id: d.id,
      photoUrl: d.photoUrl,
      capturedAt: d.capturedAt,
      metadata: d.metadata ? JSON.parse(d.metadata) : null
    }))
  }
})
