// stores/userStore.ts
import {defineStore} from 'pinia'

interface Role {
  id: string
}

interface RoleState {
  roles: Role[]
  loading: boolean
}

export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    roles: [],
    loading: false,
  }),

  actions: {
    async fetchRoles() {
      try {
        this.loading = true
        this.roles = await $fetch('/api/admin/user/roles')
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
