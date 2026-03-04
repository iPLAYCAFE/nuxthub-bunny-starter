export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user) {
    return {
      loggedIn: false,
      message: 'Not authenticated. Use /auth/github to login.'
    }
  }

  return {
    loggedIn: true,
    user: session.user,
    loggedInAt: session.loggedInAt || null
  }
})
