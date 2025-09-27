import { defineEventHandler } from 'h3'

import { deleteSessionCookie, getSessionCookie, validateSessionToken } from '../utils/auth'
import type { AuthContext } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const { value } = getSessionCookie(event)
  let context: AuthContext = {
    user: null,
    session: null
  }

  if (value) {
    const result = await validateSessionToken(event, value)
    if (result.user && result.session) {
      context = result
    } else {
      deleteSessionCookie(event)
    }
  }

  event.context.auth = context
})
