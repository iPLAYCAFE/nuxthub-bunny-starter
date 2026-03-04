export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.login,
        provider: 'github',
        name: user.name,
        email: user.email,
        phone: null,
        avatarUrl: user.avatar_url || null
      },
      loggedInAt: new Date().toISOString()
    })
    // Redirect back to the page the user was on before login
    const redirect = getCookie(event, 'auth-redirect') || '/'
    deleteCookie(event, 'auth-redirect')
    return sendRedirect(event, redirect)
  }
})
