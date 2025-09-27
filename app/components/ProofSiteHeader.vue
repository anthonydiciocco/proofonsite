<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { siteNavigationItems } from '~/constants/navigation'

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

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)
</script>

<template>
  <header
    class="sticky top-0 z-40 border-app-card bg-elevated/80 backdrop-blur-md shadow-app-card supports-[backdrop-filter]:bg-elevated/70">
    <UContainer class="py-4">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink to="/" class="inline-flex items-center" aria-label="Page d’accueil ProofOnSite">
          <AppLogo class="sm:gap-4" />
        </NuxtLink>

        <div class="hidden items-center gap-6 lg:flex">
          <UNavigationMenu :items="navigationItems" orientation="horizontal" variant="link" />
          <UButton color="secondary" variant="solid" size="sm" :to="primaryCtaTo" trailing-icon="i-lucide-arrow-right">
            {{ primaryCtaLabel }}
          </UButton>
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
                class="flex items-center justify-between rounded-xl border border-app-card bg-app-surface px-4 py-2 text-sm font-medium text-highlighted shadow-app-glow transition hover:border-secondary/60 hover:text-secondary"
                @click="isMenuOpen = false">
                {{ item.label }}
                <UIcon name="i-lucide-arrow-up-right" class="size-4 text-muted" />
              </NuxtLink>
            </li>
            <li>
              <UButton block color="secondary" variant="solid" :to="primaryCtaTo" trailing-icon="i-lucide-arrow-right"
                @click="isMenuOpen = false">
                {{ primaryCtaLabel }}
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
