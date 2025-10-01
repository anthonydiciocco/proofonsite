<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() =>
  locales.value.filter((l) => typeof l !== 'string')
)

const currentLocale = computed(() =>
  availableLocales.value.find((l) => l.code === locale.value)
)

// Créer des groupes logiques pour les langues
const languageOptions = computed(() => {
  const groups: DropdownMenuItem[][] = []

  // Groupe 1: Langues principales (EN, FR, ES)
  groups.push(
    availableLocales.value
      .filter((loc) => ['en', 'fr', 'es'].includes(loc.code))
      .map((loc) => ({
        label: loc.name,
        icon: locale.value === loc.code ? 'i-lucide-check' : undefined,
        onSelect: () => changeLocale(loc.code)
      }))
  )

  // Groupe 2: Autres langues (ZH, DE, PT)
  const otherLangs = availableLocales.value
    .filter((loc) => ['zh', 'de', 'pt'].includes(loc.code))
    .map((loc) => ({
      label: loc.name,
      icon: locale.value === loc.code ? 'i-lucide-check' : undefined,
      onSelect: () => changeLocale(loc.code)
    }))

  if (otherLangs.length > 0) {
    groups.push(otherLangs)
  }

  return groups.flat()
})

async function changeLocale(newLocale: string) {
  await setLocale(newLocale as 'en' | 'fr' | 'es' | 'zh' | 'de' | 'pt')
}
</script>

<template>
  <UDropdownMenu :items="languageOptions" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
    <UButton color="neutral" variant="ghost" size="sm" :title="$t('common.language')">
      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-globe" class="size-4" />
        <span>{{ currentLocale?.name }}</span>
      </div>
    </UButton>
  </UDropdownMenu>
</template>
