<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestFetch, useToast } from '#imports'
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import { siteNavigationItems } from '~/constants/navigation'
import { refreshAuth, useAuthState } from '../../composables/useAuth'

const props = defineProps<{
  items?: NavigationMenuItem[]
  ctaLabel?: string
  ctaTo?: string
}>()

const navigationItems = computed(() => props.items ?? siteNavigationItems)
const primaryCtaLabel = computed(() => props.ctaLabel ?? 'Planifier un pilote')
const primaryCtaTo = computed(() => props.ctaTo ?? '#cta')

const isMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const toast = useToast()
const requestFetch = useRequestFetch()
const authState = useAuthState()
const isLoggingOut = ref(false)

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)

const isAuthenticated = computed(() => authState.value.status === 'authenticated')
const currentUser = computed(() => authState.value.user)

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Tableau de bord',
      icon: 'i-lucide-layout-dashboard',
      to: '/dashboard'
    }
  ],
  [
    {
      label: 'Déconnexion',
      icon: 'i-lucide-log-out',
      disabled: isLoggingOut.value,
      onSelect: async (event) => {
        event.preventDefault()
        await handleLogout()
      }
    }
  ]
])

async function handleLogout() {
  if (isLoggingOut.value) {
    return
  }

  isLoggingOut.value = true

  try {
    await requestFetch('/api/auth/logout', {
      method: 'POST'
    })

    await refreshAuth({ force: true })
    toast.add({
      title: 'Déconnexion',
      description: 'À bientôt sur ProofOnSite.',
      color: 'neutral'
    })
    await router.push('/')
  } catch (error: unknown) {
    type FetchErrorLike = {
      data?: { message?: string }
      statusMessage?: string
    }

    const fetchError = error as FetchErrorLike
    const fallbackMessage = error instanceof Error ? error.message : null
    const message = fetchError.data?.message
      ?? fetchError.statusMessage
      ?? fallbackMessage
      ?? 'Impossible de vous déconnecter pour le moment.'
    toast.add({
      title: 'Erreur',
      description: message,
      color: 'error'
    })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 border border-secondary/10 bg-app-surface/70 backdrop-blur-md shadow-app-glow">
    <UContainer class="py-4">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink to="/" class="inline-flex items-center" aria-label="Page d'accueil ProofOnSite">
          <AppLogo class="sm:gap-4" />
        </NuxtLink>

        <div class="hidden items-center gap-6 lg:flex">
          <UNavigationMenu :items="navigationItems" orientation="horizontal" variant="link" />
          <template v-if="isAuthenticated">
            <UButton color="secondary" variant="solid" size="sm" :to="primaryCtaTo"
              trailing-icon="i-lucide-arrow-right">
              {{ primaryCtaLabel }}
            </UButton>
            <UDropdownMenu :items="userMenuItems" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
              <UButton color="neutral" variant="ghost" icon="i-lucide-user-round">
                {{ currentUser?.displayName ?? currentUser?.email }}
              </UButton>
            </UDropdownMenu>
          </template>
          <template v-else>
            <UButton color="neutral" variant="ghost" to="/login">
              Se connecter
            </UButton>
            <UButton color="secondary" variant="solid" size="sm" :to="primaryCtaTo"
              trailing-icon="i-lucide-arrow-right">
              {{ primaryCtaLabel }}
            </UButton>
          </template>
        </div>

        <div class="flex items-center gap-2">
          <UButton class="lg:hidden" variant="ghost" color="neutral" :icon="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            aria-label="Ouvrir ou fermer la navigation" @click="isMenuOpen = !isMenuOpen" />
          <UColorModeButton />
        </div>
      </div>

      <Transition name="fade">
        <nav v-if="isMenuOpen" class="mt-4 lg:hidden">
          <ul class="flex flex-col gap-2">
            <li v-for="item in navigationItems" :key="item.label">
              <NuxtLink :to="item.to"
                class="flex items-center justify-between rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-2 text-sm font-medium text-highlighted shadow-app-glow transition hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary"
                @click="isMenuOpen = false">
                {{ item.label }}
                <UIcon name="i-lucide-arrow-up-right" class="size-4 text-secondary" />
              </NuxtLink>
            </li>
            <li v-if="!isAuthenticated">
              <UButton block color="neutral" variant="ghost" to="/login" @click="isMenuOpen = false">
                Se connecter
              </UButton>
              <UButton block color="secondary" variant="solid" :to="primaryCtaTo" trailing-icon="i-lucide-arrow-right"
                @click="isMenuOpen = false">
                {{ primaryCtaLabel }}
              </UButton>
            </li>
            <li v-else>
              <UButton block color="secondary" variant="solid" to="/dashboard" trailing-icon="i-lucide-layout-dashboard"
                @click="isMenuOpen = false">
                Tableau de bord
              </UButton>
              <UButton block color="neutral" variant="ghost" :loading="isLoggingOut" @click="handleLogout">
                Se déconnecter
              </UButton>
            </li>
          </ul>
        </nav>
      </Transition>
    </UContainer>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
