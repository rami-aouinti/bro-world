// stores/userStore.ts
import {defineStore} from 'pinia'

interface UserGroup {
  id: string
}

interface UserGroupState {
  groups: UserGroup[]
  loading: boolean
}

export const useUserGroupStore = defineStore('group', {
  state: (): UserGroupState => ({
    groups: [],
    loading: false,
  }),

  actions: {
    async fetchUserGroups() {
      try {
        this.loading = true
        this.groups = await $fetch('/api/admin/user/groups')
      } catch (error) {
        console.error('Error fetching groups:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
