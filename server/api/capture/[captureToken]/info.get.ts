import { eq } from 'drizzle-orm'
import { useDb } from '../../../db'
import { sites } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const captureToken = getRouterParam(event, 'captureToken')

  if (!captureToken) {
    throw createError({
      statusCode: 400,
      message: 'Capture token is required'
    })
  }

  const db = useDb(event)

  const site = await db.query.sites.findFirst({
    where: eq(sites.captureToken, captureToken),
    columns: {
      id: true,
      name: true,
      address: true,
      referenceCode: true
    }
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      message: 'Invalid capture token'
    })
  }

  return {
    site
  }
})
