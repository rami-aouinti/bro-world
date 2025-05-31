import axios from 'axios'
import {useAuthStore} from '@/stores/useAuthStore'

export async function useAuthenticatedAxios() {
  const auth = useAuthStore()
  const token = await auth.getToken

  return await axios.create({
    baseURL: '/',
    headers: token
      ? {
        Authorization: `Bearer ${token}`,
      }
      : {},
    withCredentials: false,
  })
}
