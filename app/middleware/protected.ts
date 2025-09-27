import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

import { refreshAuth, useAuthState } from '../../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const state = useAuthState()

  if (typeof window === 'undefined') {
    if (!state.value.user) {
      return navigateTo('/login')
    }
    return
  }

  if (!state.value.initialized) {
    await refreshAuth()
  }

  if (!state.value.user) {
    return navigateTo('/login')
  }
})
