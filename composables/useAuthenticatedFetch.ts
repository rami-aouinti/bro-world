import axios from 'axios'
import {useAuthStore} from '@/stores/useAuthStore'

export function useAuthenticatedAxios() {
  const auth = useAuthStore()
  const token = auth.getToken

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
