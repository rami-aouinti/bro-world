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
          id: profile.id,
          name: profile.username,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          friends: profile?.friends,
          stories: profile?.stories,
          profile: profile?.profile,
          enabled: profile.enabled,
          photo: profile?.photo,
          token: profile.token,
          roles: profile.roles,
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
