import axios from 'axios'
import {useAuthStore} from "~/stores/useAuthStore";

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, { user })
    const auth = useAuthStore()
    const userGithubResponse = await axios.post(
      'https://bro-world.org/api/v1/user/github/verify',
      user,
    )
    const userGithub = userGithubResponse.data

    await auth.setToken(userGithub.token)
    await auth.setUser(userGithub.profile)
    return sendRedirect(event, '/')
  },
})
