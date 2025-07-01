import axios from 'axios'
import { sendRedirect, createError } from 'h3'

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    try {
      const userGithubResponse = await axios.post(
        'https://bro-world.org/api/v1/user/github/verify',
        user
      )

      const userGithub = userGithubResponse.data
      const profile = userGithub.profile

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
        message: error.response?.data?.message || 'GitHub authentication failed',
      })
    }
  },
})
