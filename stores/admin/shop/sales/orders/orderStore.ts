// stores/orderStore.ts
import {defineStore} from 'pinia'
import type {Order} from '~/types/shop/order'
import {useCachedFetch} from '~/composables/useCachedFetch'

export const useOrderStore = defineStore('orderStore', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)

  const fetchOrders = async () => {
    loading.value = true
    const cacheKey = 'admin:ecommerce:orders:all'
    try {
      return await useCachedFetch<{ 'hydra:member': Order[] }>(
        cacheKey,
        async () => {

          const {data} = await useEcommerceApi<{ 'hydra:member': Order[] }>(
            '/api/v2/admin/orders',
            {key: 'orders', immediate: true}
          )
          if (data?.value?.['hydra:member']) {
            return await data.value['hydra:member']
          }
        },
        31536000
      )
    } catch (e) {
      console.error('❌ Erreur de chargement des commandes:', e)
    } finally {
      loading.value = false
    }

    return orders.value
  }

  return {
    orders,
    loading,
    fetchOrders
  }
})
