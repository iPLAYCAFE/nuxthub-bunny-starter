import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      // Plain unit tests (no Nuxt runtime)
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      // E2E tests
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      // Tests that need Nuxt runtime (composables, components)
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt'
        },
        // Stub PWA virtual module — vitest v4 can't resolve
        // file:///@vite-plugin-pwa/virtual:pwa-register/vue URLs
        resolve: {
          alias: {
            'virtual:pwa-register/vue': resolve(__dirname, 'test/stubs/pwa-register.ts')
          }
        }
      })
    ]
  }
})
