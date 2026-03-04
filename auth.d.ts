import type { SessionUser, UserSessionData } from '#shared/types/auth'

/**
 * Type augmentation for nuxt-auth-utils
 *
 * Wires SessionUser into useUserSession().user (client)
 * and setUserSession()/getUserSession() (server).
 */
declare module '#auth-utils' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends SessionUser {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface UserSession extends UserSessionData {}
}

export {}
