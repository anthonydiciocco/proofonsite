import { watch } from 'vue'

// @ts-expect-error - defineNuxtPlugin is auto-imported
export default defineNuxtPlugin(() => {
  // @ts-expect-error - Auto-imported composables
  const { locale, locales: availableLocales } = useI18n()
  // @ts-expect-error - Auto-imported composables
  const route = useRoute()
  // @ts-expect-error - Auto-imported composables
  const config = useRuntimeConfig()

  // Ajouter l'attribut lang au HTML
  watch(locale, (newLocale: string) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('lang', newLocale)
    }
  }, { immediate: true })

  // Ajouter automatiquement les liens hreflang pour le SEO
  watch(() => route.path, () => {
    const locales = availableLocales.value.map((l: any) => l.code)
    const currentPath = route.path
    const baseUrl = config.public.appUrl

    const links = locales.map((loc: string) => ({
      rel: 'alternate',
      hreflang: loc,
      href: `${baseUrl}/${loc === 'en' ? '' : loc}${currentPath}`.replace(/\/+/g, '/')
    }))

    // Ajouter x-default
    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${baseUrl}${currentPath}`
    })

    // @ts-expect-error - Auto-imported composable
    useHead({
      link: links
    })
  }, { immediate: true })
})
