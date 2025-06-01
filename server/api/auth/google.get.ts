import axios from 'axios'
import {useAuthStore} from "~/stores/useAuthStore";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, { user })
    const auth = useAuthStore()
    const userGoogleResponse = await axios.post(
      'https://bro-world.org/api/v1/user/google/verify',
      user,
    )
    const userGoogle = userGoogleResponse.data

    await auth.setToken(userGoogle.token)
    await auth.setUser(userGoogle.profile)
    return sendRedirect(event, '/')
  },
})
