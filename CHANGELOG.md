# Changelog

All notable changes to this project will be documented in this file.

See [changelogen](https://github.com/unjs/changelogen) for commit guidelines.

## v1.0.0

Initial release of the NuxtHub × bunny.net Full-Stack Starter.

### 🚀 Features

- **NuxtHub Data Layer** — Database (Drizzle + libSQL), Blob (S3), KV (Redis), Cache
- **Bunny Services** — 10 bunny.net services with i18n descriptions and icons
- **Auth** — Provider-agnostic multi-provider auth types (GitHub, Google, LINE, Telegram, Email, Phone)
- **WebSocket** — Real-time demo via CrossWS (Nitro built-in)
- **Rate Limiting** — Redis-backed sliding window with conditional TTL
- **Docker Deployment** — Multi-stage Dockerfile with Bun runtime for Magic Containers
- **CI/CD** — GitHub Actions with GHA Docker cache, DB migrations, and multi-environment deploy
- **i18n** — English, Thai, Chinese locales
- **SEO** — OG Image, Sitemap, Robots, llms.txt
- **PWA** — Installable progressive web app
- **Studio** — Self-hosted Nuxt Studio content editing
- **Testing** — Unit tests (45), E2E API tests (11), Nuxt component tests

### 🏗️ Infrastructure

- Nuxt 5 (`future.compatibilityVersion: 5`)
- Bun ≥ 1.3 (Nitro `bun` preset)
- Redis 7 sidecar for sessions, rate limiting, KV
- Bunny CDN image optimization
- Non-root Docker container (`USER bun`)

### 📦 Modules (20)

@nuxthub/core, @nuxt/ui, @nuxt/content, @nuxt/image, @nuxt/fonts, @nuxt/scripts, @nuxt/hints, @nuxt/a11y, @nuxt/eslint, @nuxt/icon, @nuxt/test-utils, @nuxtjs/i18n, @nuxtjs/color-mode, @nuxtjs/sitemap, @nuxtjs/robots, @nuxtjs/mdc, nuxt-auth-utils, nuxt-og-image, nuxt-security, @vite-pwa/nuxt
