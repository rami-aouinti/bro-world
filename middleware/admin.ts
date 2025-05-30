export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    Notify.error('You need to log in to view this page')
    return navigateTo('/')
  }

  const hasAccess = user.value?.roles?.includes('ROLE_ADMIN')

  if (!hasAccess) {
    Notify.error('You are not authorized to access this page')
    return navigateTo('/')
  }
})
