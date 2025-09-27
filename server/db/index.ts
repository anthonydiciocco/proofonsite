import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import * as schema from './schema'

neonConfig.fetchConnectionCache = true

let client: ReturnType<typeof neon> | null = null
let db: NeonHttpDatabase<typeof schema> | null = null

function resolveDatabaseUrl(event?: H3Event) {
  const runtimeConfig = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const configuredUrl = runtimeConfig?.databaseUrl as string | undefined
  return configuredUrl || process.env.DATABASE_URL || ''
}

export function useDb(event?: H3Event) {
  const databaseUrl = resolveDatabaseUrl(event)
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Provide it via environment variable or runtime config.')
  }

  if (!client) {
    client = neon(databaseUrl)
  }

  if (!db) {
    db = drizzle({ client, schema })
  }

  return db
}

export { schema }
export type Database = NeonHttpDatabase<typeof schema>
