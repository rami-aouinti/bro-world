import axios from 'axios'
import { sendRedirect, createError } from 'h3'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    try {
      const userGoogleResponse = await axios.post(
        'https://bro-world.org/api/v1/user/google/verify',
        user
      )

      const userGoogle = userGoogleResponse.data
      const profile = userGoogle.profile

      await setUserSession(event, {
        user: {
          id: user.id,
          name: user.username,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          friends: user?.friends,
          stories: user?.stories,
          profile: user?.profile,
          enabled: user.enabled,
          photo: user?.photo,
          token: user.token,
          roles: user.roles,
        },
      })

      return sendRedirect(event, '/')
    } catch (error: any) {
      throw createError({
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || 'Google authentication failed',
      })
    }
  },
})
