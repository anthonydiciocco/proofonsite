/**
 * Get current feature flags
 * Public endpoint - no auth required
 */
export default defineEventHandler(() => {
  return getBetaConfig()
})
