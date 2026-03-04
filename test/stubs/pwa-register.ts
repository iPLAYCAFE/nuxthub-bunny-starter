// Stub for virtual:pwa-register/vue — vitest v4 can't handle
// the virtual module URL format used by @vite-pwa/nuxt
export function useRegisterSW() {
  return {
    needRefresh: { value: false },
    offlineReady: { value: false },
    updateServiceWorker: () => { }
  }
}
