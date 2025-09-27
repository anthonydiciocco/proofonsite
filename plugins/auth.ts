import { defineNuxtPlugin } from 'nuxt/app'

import { refreshAuth, useAuthState } from '../composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const state = useAuthState()

  if (nuxtApp.ssrContext) {
    const auth = nuxtApp.ssrContext.event.context.auth ?? { user: null, session: null }
    state.value.user = auth.user
    state.value.session = auth.session
    state.value.status = auth.user ? 'authenticated' : 'unauthenticated'
    state.value.initialized = true
    return
  }

  if (!state.value.initialized) {
    await refreshAuth()
  }
})
