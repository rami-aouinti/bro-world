// stores/userStore.ts
import {defineStore} from 'pinia'

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar: string | null
  roles: string[]
}

interface UserState {
  users: User[]
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
  }),

  actions: {
    async fetchUsers() {
      try {
        this.loading = true
        this.users = await $fetch('/api/admin/user/users')
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    async addUser(user: User) {
      try {
        const token = this.getToken()
        const response = await $fetch('https://bro-world.org/api/v1/user', {
          method: 'POST',
          body: user,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.users.push(response)
      } catch (error) {
        console.error('Error adding user:', error)
      }
    },

    async updateUser(userId: string, updatedUser: User) {
      try {
        const token = this.getToken()
        const response = await $fetch(
          `https://bro-world.org/api/v1/user/${userId}`,
          {
            method: 'PUT',
            body: updatedUser,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const index = this.users.findIndex((user) => user.id === userId)
        if (index !== -1) {
          this.users[index] = response
        }
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },

    async deleteUser(userId: string) {
      try {
        const token = this.getToken()
        await $fetch(`https://bro-world.org/api/v1/user/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.users = this.users.filter((user) => user.id !== userId)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    },
  },
})
