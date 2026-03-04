/**
 * Auth provider identifiers
 *
 * Add new providers here as they are integrated.
 * nuxt-auth-utils supports 50+ OAuth providers out of the box.
 * @see https://github.com/atinux/nuxt-auth-utils#supported-oauth-providers
 */
export type AuthProvider = 'github' | 'google' | 'line' | 'telegram' | 'email' | 'phone'

/**
 * Provider-agnostic user session — shared between server and client
 *
 * Each OAuth handler maps provider-specific fields to these normalized fields.
 * Only `id` and `provider` are required — all others are optional because
 * not every provider returns the same profile data.
 *
 * Used by nuxt-auth-utils `setUserSession()` and `useUserSession()`
 * Lives in shared/ (Nuxt 5 feature) for auto-import in both contexts.
 */
export interface SessionUser {
  /** Provider-specific user ID (e.g., GitHub login, LINE userId, Google sub) */
  id: string
  /** Which auth provider was used */
  provider: AuthProvider
  /** Display name */
  name: string | null
  /** Email address (not available on all providers) */
  email: string | null
  /** Phone number (for phone/SMS auth) */
  phone: string | null
  /** Profile picture URL */
  avatarUrl: string | null
}

export interface UserSessionData {
  user: SessionUser
  loggedInAt: string
}
