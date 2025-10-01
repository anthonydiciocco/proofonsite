import type { NavigationMenuItem } from '@nuxt/ui'

// Navigation structure (keys for i18n translation)
export const navigationStructure = [
  { key: 'product', to: '#product' },
  { key: 'workflow', to: '#workflow' },
  { key: 'benefits', to: '#benefits' },
  { key: 'pricing', to: '#pricing' },
  { key: 'faq', to: '#faq' }
] as const

// Helper function to create navigation items with i18n
export function createNavigationItems(t: (key: string) => string): NavigationMenuItem[] {
  return navigationStructure.map(item => ({
    label: t(`nav.${item.key}`),
    to: item.to
  }))
}
