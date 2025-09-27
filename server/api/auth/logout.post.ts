import { defineEventHandler } from 'h3'

import { deleteSessionCookie, getSessionCookie, invalidateSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const currentSession = event.context.auth?.session

  if (currentSession) {
    await invalidateSession(event, currentSession.id)
  } else {
    const { value } = getSessionCookie(event)
    if (value) {
      const [sessionId] = value.split('.')
      if (sessionId) {
        await invalidateSession(event, sessionId)
      }
    }
  }

  deleteSessionCookie(event)
  event.context.auth = { user: null, session: null }

  return {
    success: true
  }
})
