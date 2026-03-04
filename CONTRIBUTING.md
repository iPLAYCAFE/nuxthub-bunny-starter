# Contributing

Thank you for your interest in contributing to the NuxtHub × bunny.net Starter!

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3
- [Node.js](https://nodejs.org) ≥ 20 (for `npx nuxt db migrate`)
- [Docker](https://www.docker.com) (optional, for container testing)

## Setup

```bash
git clone https://github.com/iPLAYCAFE/nuxthub-bunny-starter.git
cd nuxthub-bunny-starter
bun install
bun run dev
```

All NuxtHub features (Database, KV, Blob, Cache) work locally without any configuration.

## Development Workflow

```bash
bun run dev          # Start dev server
bun run lint         # Run ESLint
bun run lint --fix   # Auto-fix lint issues
bun run typecheck    # Run TypeScript checks
bun run test:unit    # Run unit tests
bun run test:nuxt    # Run Nuxt component tests
bun run test:e2e     # Run E2E API tests (starts dev server)
bun run test:all     # Run all test suites
```

## Database Changes

```bash
vim server/db/schema.ts    # 1. Edit schema
bunx nuxt db generate      # 2. Generate migration
npx nuxt db migrate        # 3. Apply migration (use npx, not bunx!)
```

> **Note:** Use `npx` (not `bunx`) for `db migrate` due to a `@libsql/client` HTTP transport issue with Bun.

## Code Style

- 2 spaces, LF line endings
- Always use `defineEventHandler()` (not `eventHandler()`)
- `commaDangle: 'never'`, `braceStyle: '1tbs'`
- Run `bun run lint --fix` before committing

## Project Structure

```
app/            # Nuxt app layer (pages, components, assets)
server/         # Nitro server (API routes, middleware, plugins)
  db/           # Drizzle schema + migrations
  utils/        # Auto-imported server utilities
shared/         # Shared types (auto-imported in both contexts)
i18n/           # Locale files (EN, TH, ZH)
content/        # Nuxt Content / Studio markdown
test/           # Unit, E2E, and Nuxt component tests
```

## Pull Request Guidelines

1. Create a feature branch from `main`
2. Keep changes focused — one feature/fix per PR
3. Ensure `bun run lint` and `bun run typecheck` pass
4. Add tests for new API routes or utilities
5. Update `Agents.md` if adding new patterns or conventions
