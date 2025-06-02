import axios from 'axios'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {

    const userGoogleResponse = await axios.post(
      'https://bro-world.org/api/v1/user/google/verify',
      user,
    )
    const userGoogle = userGoogleResponse.data

    await setUserSession(event, {
      user: {
        id: userGoogle.profile.id,
        name: userGoogle.profile.username,
        username: userGoogle.profile.username,
        firstName: userGoogle.profile.firstName,
        lastName: userGoogle.profile.lastName,
        email: userGoogle.profile.email,
        avatar: userGoogle.profile?.picture,
        token: userGoogle.token,
        roles: userGoogle.profile.roles,
      }
    })

    return sendRedirect(event, '/')
  },
})
