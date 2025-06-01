import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export async function useAuthenticatedAxios(): Promise<typeof axios> {
  const auth = useAuthStore()

  // Retry loop : attendre jusqu'à 1s (10 x 100ms)
  let retries = 10
  let token = auth.getToken

  while ((!token || token.trim() === '') && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100)) // attendre 100ms
    token = auth.getToken
    retries--
  }

  return axios.create({
    baseURL: '/',
    headers: token
      ? {
        Authorization: `Bearer ${token}`,
      }
      : {},
    withCredentials: false,
  })
}
