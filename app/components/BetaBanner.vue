<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: features } = await useFetch('/api/features')
const showBanner = ref(true)

// Check if user has dismissed the banner in this session
onMounted(() => {
  const dismissed = sessionStorage.getItem('betaBannerDismissed')
  if (dismissed === 'true') {
    showBanner.value = false
  }
})

const dismissBanner = () => {
  showBanner.value = false
  sessionStorage.setItem('betaBannerDismissed', 'true')
}
</script>

<template>
  <div v-if="features?.isActive && features.bannerEnabled && showBanner"
    class="bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800">
    <UContainer class="py-2.5">
      <div class="flex items-center justify-between gap-4">
        <!-- Message compact -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <UIcon name="i-lucide-sparkles" class="size-5 text-green-600 dark:text-green-400 shrink-0 animate-pulse" />
          <p class="text-sm font-semibold text-green-900 dark:text-green-100 truncate">
            {{ t('beta.bannerMessage') }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <UButton :to="localePath('/register')" color="success" variant="solid" size="xs"
            trailing-icon="i-lucide-arrow-right">
            {{ t('beta.signupCta') }}
          </UButton>

          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" square @click="dismissBanner"
            :aria-label="t('common.close')"
            class="text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50" />
        </div>
      </div>
    </UContainer>
  </div>
</template>
