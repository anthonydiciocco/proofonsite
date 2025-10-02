import { and, eq } from 'drizzle-orm'
import { del } from '@vercel/blob'
import { useDb } from '../../../../db'
import { deliveries, sites } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth/guard'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const db = useDb(event)
  const siteId = getRouterParam(event, 'id')
  const deliveryId = getRouterParam(event, 'deliveryId')

  if (!siteId || !deliveryId) {
    throw createError({
      statusCode: 400,
      message: 'Site ID and Delivery ID are required'
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

  // Find the delivery
  const delivery = await db.query.deliveries.findFirst({
    where: and(
      eq(deliveries.id, deliveryId),
      eq(deliveries.siteId, siteId)
    )
  })

  if (!delivery) {
    throw createError({
      statusCode: 404,
      message: 'Delivery not found'
    })
  }

  // Delete photo from Vercel Blob
  try {
    await del(delivery.photoUrl)
  }
  catch (error) {
    console.error('Failed to delete blob:', error)
    // Continue anyway - blob might already be deleted
  }

  // Delete delivery from database
  await db.delete(deliveries)
    .where(eq(deliveries.id, deliveryId))

  return {
    success: true
  }
})
