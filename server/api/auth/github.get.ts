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
          id: profile.id,
          name: profile.username,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          avatar: profile.avatar_url,
          enabled: userGithub.enabled,
          profile: profile,
          token: userGithub.token,
          roles: profile.roles,
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
