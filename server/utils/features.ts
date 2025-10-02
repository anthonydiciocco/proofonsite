/**
 * Feature Flags for ProofOnSite
 *
 * Simple configuration to control beta access and other features
 */

export const FEATURES = {
  // Beta mode: When true, all new signups are automatically beta users with unlimited access
  IS_BETA: true,

  // Beta welcome message shown to users
  BETA_MESSAGE: 'Version beta gratuite — Accès illimité pendant la validation',

  // Beta banner on landing page
  BETA_BANNER_ENABLED: true,
} as const

/**
 * Check if beta mode is currently active
 */
export function isBetaActive(): boolean {
  return FEATURES.IS_BETA
}

/**
 * Get beta configuration
 */
export function getBetaConfig() {
  return {
    isActive: FEATURES.IS_BETA,
    message: FEATURES.BETA_MESSAGE,
    bannerEnabled: FEATURES.BETA_BANNER_ENABLED,
  }
}
