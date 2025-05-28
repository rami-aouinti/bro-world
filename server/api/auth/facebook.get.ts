import {defineOAuthFacebookEventHandler} from "#imports";

export default defineOAuthFacebookEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  },
})
