# ── Base image ───────────────────────────────────────────
FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# ── Install dependencies ────────────────────────────────
FROM base AS install

# Dev dependencies (needed for build)
RUN mkdir -p /temp/dev
COPY package.json bun.lock* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --ignore-scripts

# Production dependencies only (for final image)
# No --ignore-scripts: allows native binary resolution (e.g. @libsql/linux-x64-musl)
RUN mkdir -p /temp/prod
COPY package.json bun.lock* /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# ── Build Stage ──────────────────────────────────────────
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# S3 env vars needed at build time for NuxtHub blob auto-detection
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_BUCKET
ARG S3_REGION
ARG S3_ENDPOINT

RUN S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
    S3_BUCKET=$S3_BUCKET \
    S3_REGION=$S3_REGION \
    S3_ENDPOINT=$S3_ENDPOINT \
    bun --bun run build

# ── Production Stage ─────────────────────────────────────
FROM base AS runtime

LABEL org.opencontainers.image.source="https://github.com/iPLAYCAFE/nuxthub-bunny-starter"
LABEL org.opencontainers.image.description="NuxtHub × bunny.net Full-Stack Starter"

COPY --from=build --chown=bun /app/.output .output
COPY --from=install /temp/prod/node_modules /tmp/prod_nm

# Merge node_modules using save → replace → restore pattern:
#   1. Save Nitro-generated virtual modules (@nuxthub/db, @nuxthub/core aliases)
#   2. Replace with production deps (includes native binaries like @libsql/linux-x64-musl)
#   3. Restore Nitro virtual modules on top (overwrite = virtual modules take precedence)
#   4. Clean /tmp in same layer to avoid bloating image
# Note: Alpine busybox `cp` does not support `-n` (no-clobber), so we use this pattern instead.
RUN mv .output/server/node_modules /tmp/nitro_nm && \
    mv /tmp/prod_nm .output/server/node_modules && \
    cp -rf /tmp/nitro_nm/. .output/server/node_modules/ 2>/dev/null; \
    rm -rf /tmp/nitro_nm /tmp/prod_nm && \
    chown -R bun:bun .output

# Create cache directories for Nitro runtime (icons, i18n, handlers)
RUN mkdir -p .data/cache && chown -R bun:bun .data

# ── Security: run as non-root ────────────────────────────
# oven/bun:*-alpine ships with user `bun` (UID 1000)
USER bun

# ── Runtime Environment ─────────────────────────────────
# Database/CDN env vars set via Magic Container env vars at runtime
# See Agents.md for full list: LIBSQL_URL, LIBSQL_AUTH_TOKEN, BUNNY_CDN_URL
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production
ENV REDIS_URL=redis://127.0.0.1:6379

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Graceful shutdown: Magic Containers sends SIGTERM → 30s grace → SIGKILL
# See: https://docs.bunny.net/magic-containers/graceful-shutdown
STOPSIGNAL SIGTERM

CMD ["bun", "--bun", ".output/server/index.mjs"]
