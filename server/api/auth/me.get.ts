import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const auth = event.context.auth ?? { user: null, session: null }
  return {
    user: auth.user,
    session: auth.session
  }
})
