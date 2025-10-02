import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

import { refreshAuth, useAuthState } from '../../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const state = useAuthState()
  const localePath = useLocalePath()

  if (typeof window === 'undefined') {
    if (!state.value.user) {
      return navigateTo(localePath('/login'))
    }
    return
  }

  if (!state.value.initialized) {
    await refreshAuth()
  }

  if (!state.value.user) {
    return navigateTo(localePath('/login'))
  }
})
