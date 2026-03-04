export default {
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },
  /** GitHub repository — single source of truth for all repo links */
  github: {
    owner: 'iPLAYCAFE',
    repo: 'nuxthub-bunny-starter',
    url: 'https://github.com/iPLAYCAFE/nuxthub-bunny-starter'
  },
  /** Deploy page code snippets — shown on the Services page
   *  Note: this is a simplified Dockerfile example for display purposes.
   *  See the actual Dockerfile in the repo root for the production version
   *  (includes node_modules merge, S3 build args, HEALTHCHECK, etc.) */
  deploy: {
    dockerfileSnippet: `FROM oven/bun:1.3-alpine AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /app/node_modules node_modules
COPY . .
RUN bun --bun run build

FROM base AS runtime
COPY --from=build /app/.output .output
ENV HOST=0.0.0.0 PORT=3000
EXPOSE 3000
USER bun
CMD ["bun", "--bun", ".output/server/index.mjs"]`,
    envVarsSnippet: `# NuxtHub Database → Bunny Database
LIBSQL_URL=libsql://your-db.lite.bunnydb.net
LIBSQL_AUTH_TOKEN=your-token

# NuxtHub Blob → Bunny Storage S3
S3_ACCESS_KEY_ID=<storage-zone-name>
S3_SECRET_ACCESS_KEY=<storage-zone-password>
S3_BUCKET=<storage-zone-name>
S3_ENDPOINT=https://[region].storage.bunnycdn.com
S3_REGION=[region]

# Session encryption key (32+ chars)
NUXT_SESSION_PASSWORD=your-secret-key-min-32-chars

# Redis Sidecar (auto on Magic Containers)
REDIS_URL=redis://127.0.0.1:6379`
  }
}
