export default defineEventHandler(() => ({
  github: !!(process.env.NUXT_OAUTH_GITHUB_CLIENT_ID && process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET)
}))
