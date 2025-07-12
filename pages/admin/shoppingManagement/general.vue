<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'
import SalesChart from "~/components/Chart/SalesChart.vue";

definePageMeta({
  icon: 'mdi-products',
  title: 'General Settings',
  requiresAdmin: true,
  drawerIndex: 0,
})
const loading = ref(true)
const salesData = ref<any[]>([])

const loadStatistics = async () => {
  loading.value = true
  try {
    salesData.value = await $fetch('/api/admin/shop/statistics/statistics')
  } catch (e) {
    console.error('❌ Erreur de chargement des produits:', e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadStatistics()
  await nextTick()
})
</script>
<template>
  <v-container fluid>
    <SalesChart
      :sales="salesData?.sales || []"
      :business-activity-summary="salesData?.businessActivitySummary || {}"
    />
  </v-container>
</template>

