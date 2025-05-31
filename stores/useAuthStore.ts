// stores/useAuthStore.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  username: string
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
  roles?: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '' as string,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
  },

  actions: {
    setUser(user: User) {
      this.user = user
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem('auth_token', token)
    },
  },
})
