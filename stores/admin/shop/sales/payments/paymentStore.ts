// stores/paymentStore.ts
import {defineStore} from 'pinia'
import type {Payment} from '~/types/shop/payment'
import {useCachedFetch} from '~/composables/useCachedFetch'

export const usePaymentStore = defineStore('paymentStore', () => {
  const payments = ref<Payment[]>([])
  const loading = ref(false)

  const fetchPayments = async () => {
    loading.value = true
    const cacheKey = 'admin:ecommerce:payments:all'
    try {
      return await useCachedFetch<{ 'hydra:member': Payment[] }>(
        cacheKey,
        async () => {

          const {data} = await useEcommerceApi<{ 'hydra:member': Payment[] }>(
            '/api/v2/admin/payments',
            {key: 'payments', immediate: true}
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

    return payments.value
  }

  return {
    payments,
    loading,
    fetchPayments
  }
})
