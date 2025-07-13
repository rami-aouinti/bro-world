<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'
import SalesChart from "~/components/Chart/SalesChart.vue";
import {useOrderStore} from "~/stores/admin/shop/sales/orders/orderStore";
import StatsCard from "~/components/StatsCard.vue";
import ChartLine from "~/components/Chart/ChartLine.vue";
import ChartBar from "~/components/Chart/ChartBar.vue";
import ChartRadar from "~/components/Chart/ChartRadar.vue";
import ChartPie from "~/components/Chart/ChartPie.vue";

definePageMeta({
  icon: 'mdi-chart-bubble',
  title: 'General Settings',
  requiresAdmin: true,
  drawerIndex: 0,
})
const loading = ref(true)
const search = ref('')
const dataStat = ref<any[]>([])
const orderStore = useOrderStore()
async function loadOrders() {
  try {
    const data = await orderStore.fetchOrders()
    if (data) {
      dataStat.value = data
      loading.value = false
    }
  } catch (e) {
    console.error('Erreur lors de la récupération des utilisateurs :', e)
  }
}
watch(loading, async () => {
  await loadOrders()
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadOrders()
  await nextTick()
})
const stats = ref([
  {
    icon: 'mdi-web',
    title: 'Bandwidth',
    value: 23,
    unit: 'GB',
    color: 'primary',
    caption: 'Up: 13, Down: 10',
  },
  {
    icon: 'mdi-rss',
    title: 'Submissions',
    value: 108,
    color: 'primary',
    caption: 'Too young, too naive',
  },
  {
    icon: 'mdi-send',
    title: 'Requests',
    value: 1238,
    color: 'warning',
    caption: 'Limit: 1320',
  },
  {
    icon: 'mdi-account',
    title: 'Users',
    value: 123,
    color: 'success',
    caption: 'New users this month',
  }
])
</script>
<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <StatsCard
          :title="stat.title"
          :unit="stat.unit"
          :color="stat.color"
          :icon="stat.icon"
          :value="stat.value"
        >
          <template #footer>
            {{ stat.caption }}
          </template>
        </StatsCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-2">
          <ChartLine />
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-2">
          <ChartRadar />
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-2">
          <ChartPie />
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-2">
          <ChartBar />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

