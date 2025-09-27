import { useRequestEvent, useRequestFetch, useState } from '#imports'
import { computed } from 'vue'

import type { AuthContext, AuthSession, AuthUser } from '../server/utils/auth'

interface AuthState {
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  initialized: boolean
  user: AuthUser | null
  session: AuthSession | null
}

function initialState(): AuthState {
  if (typeof window === 'undefined') {
    const event = useRequestEvent()
    const context = event?.context.auth ?? { user: null, session: null }
    return {
      status: context.user ? 'authenticated' : 'unauthenticated',
      initialized: true,
      user: context.user,
      session: context.session
    }
  }

  return {
    status: 'idle',
    initialized: false,
    user: null,
    session: null
  }
}

export function useAuthState() {
  return useState<AuthState>('auth-state', initialState)
}

function updateState(state: AuthState, payload: AuthContext) {
  state.user = payload.user
  state.session = payload.session
  state.status = payload.user ? 'authenticated' : 'unauthenticated'
  state.initialized = true
}

export async function refreshAuth(options: { force?: boolean } = {}) {
  const state = useAuthState()

  if (state.value.initialized && !options.force && typeof window !== 'undefined') {
    return state.value
  }

  state.value.status = 'loading'

  try {
    const requestFetch = useRequestFetch()
    const result = await requestFetch<AuthContext>('/api/auth/me', {
      method: 'GET',
      credentials: 'include'
    })
    updateState(state.value, result)
  } catch {
    state.value.user = null
    state.value.session = null
    state.value.status = 'unauthenticated'
    state.value.initialized = true
  }

  return state.value
}

export function useAuthUser() {
  const state = useAuthState()
  return computed(() => state.value.user)
}

export function useIsAuthenticated() {
  const state = useAuthState()
  return computed(() => state.value.status === 'authenticated')
}
