import { desc, eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'

import { useDb } from '../../db'
import { sites } from '../../db/schema'
import { requireAuthUser } from '../../utils/auth'
import { serializeSite } from '../../utils/sites'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const db = useDb(event)

  const records = await db.query.sites.findMany({
    where: eq(sites.ownerId, user.id),
    orderBy: desc(sites.createdAt)
  })

  return records.map(serializeSite)
})
