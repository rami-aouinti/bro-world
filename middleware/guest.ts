export default defineNuxtRouteMiddleware(() => {
  const { user, loggedIn, clear } = useUserSession()

  if (user.value) {
    Notify.error('You need to log in to view this page')
    return navigateTo('/')
  }
})
