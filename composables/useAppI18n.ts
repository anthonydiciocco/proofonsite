import { computed } from 'vue'

export function useAppI18n() {
  // @ts-expect-error - useI18n is auto-imported by @nuxtjs/i18n
  const { t, locale, locales, setLocale } = useI18n()

  const currentLocaleInfo = computed(() => {
    const current = locales.value.find((l: any) => l.code === locale.value)
    return current || { code: 'en', name: 'English' }
  })

  return {
    t,
    locale,
    locales,
    setLocale,
    currentLocaleInfo
  }
}
