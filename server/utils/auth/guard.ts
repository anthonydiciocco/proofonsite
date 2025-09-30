import { createError } from 'h3'
import type { H3Event } from 'h3'

import type { AuthContext, AuthUser } from './types'

function resolveAuthContext(event: H3Event): AuthContext {
  return event.context.auth ?? { user: null, session: null }
}

export function requireAuthUser(event: H3Event): AuthUser {
  const { user } = resolveAuthContext(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  return user
}
