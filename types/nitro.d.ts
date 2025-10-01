import type { AuthContext } from '../server/utils/auth'

declare module 'h3' {
  interface H3EventContext {
    auth?: AuthContext
  }
}

declare global {
  interface ImportMeta {
    client?: boolean
  }
}

export { }
