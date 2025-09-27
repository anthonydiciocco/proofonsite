// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

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
