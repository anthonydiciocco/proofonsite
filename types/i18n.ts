/**
 * Type helper for i18n translation keys with autocompletion
 *
 * Usage:
 * ```typescript
 * const { t } = useI18n<MessageSchema>()
 * t('common.loading') // ✅ Autocomplete
 * t('invalid.key')    // ❌ TypeScript error
 * ```
 */

export interface MessageSchema {
  common: {
    appName: string
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    close: string
    back: string
    next: string
    submit: string
    search: string
    noResults: string
    required: string
    optional: string
    yes: string
    no: string
  }
  nav: {
    home: string
    dashboard: string
    login: string
    register: string
    logout: string
    features: string
    pricing: string
    contact: string
    cta: string
  }
  hero: {
    subtitle: string
    title: string
    description: string
    cta: {
      demo: string
      contact: string
    }
  }
  dashboard: {
    greeting: string
    welcome: string
    metrics: {
      total: string
      active: string
      archived: string
      lastCreated: string
    }
    sites: {
      title: string
      searchPlaceholder: string
      filterByStatus: string
      addNew: string
      columns: {
        site: string
        code: string
        status: string
        qr: string
        actions: string
      }
      status: {
        active: string
        archived: string
      }
      actions: {
        view: string
        edit: string
        archive: string
        activate: string
        downloadQR: string
        delete: string
      }
      form: {
        title: {
          create: string
          edit: string
        }
        name: {
          label: string
          placeholder: string
        }
        address: {
          label: string
          placeholder: string
        }
        status: {
          label: string
        }
        cancel: string
        save: string
      }
      toast: {
        created: string
        updated: string
        deleted: string
        archived: string
        activated: string
        codeCopied: string
        qrDownloaded: string
        error: string
      }
    }
  }
  auth: {
    login: {
      title: string
      subtitle: string
      email: {
        label: string
        placeholder: string
      }
      password: {
        label: string
        placeholder: string
      }
      submit: string
      noAccount: string
      register: string
    }
    register: {
      title: string
      subtitle: string
      displayName: {
        label: string
        placeholder: string
      }
      email: {
        label: string
        placeholder: string
      }
      password: {
        label: string
        placeholder: string
      }
      submit: string
      hasAccount: string
      login: string
    }
    logout: string
  }
  meta: {
    home: {
      title: string
      description: string
    }
    dashboard: {
      title: string
    }
    login: {
      title: string
    }
    register: {
      title: string
    }
  }
}

// Helper type pour les clés de traduction
export type TranslationKey = NestedKeyOf<MessageSchema>

type NestedKeyOf<T> = T extends object
  ? {
    [K in keyof T]-?: K extends string
    ? T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K
    : never
  }[keyof T]
  : never
