// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json', iso: 'en-US' },
      { code: 'fr', name: 'Français', file: 'fr.json', iso: 'fr-CA' },
      { code: 'es', name: 'Español', file: 'es.json', iso: 'es-ES' },
      { code: 'zh', name: '中文', file: 'zh.json', iso: 'zh-CN' },
      { code: 'de', name: 'Deutsch', file: 'de.json', iso: 'de-DE' },
      { code: 'pt', name: 'Português', file: 'pt.json', iso: 'pt-BR' }
    ],
    // @ts-expect-error - lazy is a valid option in @nuxtjs/i18n
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    },
    vueI18n: './i18n/i18n.config.ts'
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    session: {
      cookieName: process.env.SESSION_COOKIE_NAME || 'pos_session',
      cookieDomain: process.env.SESSION_COOKIE_DOMAIN || undefined,
      maxAge: Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 30)
    },
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/proofonsite_gold.svg' },
        { rel: 'apple-touch-icon', href: '/proofonsite_gold.svg' }
      ]
    }
  },

  typescript: {
    strict: true,
    tsConfig: {
      include: ['types/**/*.d.ts']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
