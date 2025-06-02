import axios from 'axios'

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {

    const userGithubResponse = await axios.post(
      'https://bro-world.org/api/v1/user/github/verify',
      user,
    )
    const userGithub = userGithubResponse.data

    await setUserSession(event, {
      user: {
        id: userGithub.profile.id,
        name: userGithub.profile.username,
        username: userGithub.profile.username,
        firstName: userGithub.profile.firstName,
        lastName: userGithub.profile.lastName,
        email: userGithub.profile.email,
        avatar: userGithub.profile.avatar,
        token: userGithub.token,
        roles: userGithub.profile.roles,
      }
    })
    return sendRedirect(event, '/')
  },
})
