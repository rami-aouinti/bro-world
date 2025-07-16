// stores/shipmentStore.ts
import {defineStore} from 'pinia'
import type {Shipment} from '~/types/shop/shipment'
import {useCachedFetch} from '~/composables/useCachedFetch'

export const useShipmentStore = defineStore('shipmentStore', () => {
  const shipments = ref<Shipment[]>([])
  const loading = ref(false)

  const fetchShipments = async () => {
    loading.value = true
    const cacheKey = 'admin:ecommerce:shipments:all'
    try {
      return await useCachedFetch<{ 'hydra:member': Shipment[] }>(
        cacheKey,
        async () => {

          const {data} = await useEcommerceApi<{ 'hydra:member': Shipment[] }>(
            '/api/v2/admin/shipments',
            {key: 'shipments', immediate: true}
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

    return shipments.value
  }

  return {
    shipments,
    loading,
    fetchShipments
  }
})
