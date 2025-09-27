import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

import { refreshAuth, useAuthState } from '../../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const state = useAuthState()

  if (typeof window === 'undefined') {
    if (state.value.user) {
      return navigateTo('/dashboard')
    }
    return
  }

  if (!state.value.initialized) {
    await refreshAuth()
  }

  if (state.value.user) {
    return navigateTo('/dashboard')
  }
})
