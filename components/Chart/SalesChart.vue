<!-- components/Charts/SalesOverview.vue -->
<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  sales: { period: string; total: number; paidOrdersCount: number }[]
  businessActivitySummary: {
    totalSales: number
    paidOrdersCount: number
    newCustomersCount: number
    averageOrderValue: number
  }
}>()

const chartData = {
  labels: props.sales.map(s => s.period),
  datasets: [
    {
      label: 'Sales (€)',
      backgroundColor: '#3f51b5',
      data: props.sales.map(s => s.total),
    },
    {
      label: 'Orders',
      backgroundColor: '#9c27b0',
      data: props.sales.map(s => s.paidOrdersCount),
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: 'Monthly Sales Overview',
    },
  },
}
</script>

<template>
  <v-card rounded="xl" elevation="4" class="pa-4">
    <v-row>
      <v-col cols="6" md="3">
        <v-card class="pa-4" color="primary" variant="tonal">
          <div class="text-caption">Total Sales</div>
          <div class="text-h6 font-weight-bold">{{ businessActivitySummary.totalSales }} €</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="pa-4" color="secondary" variant="tonal">
          <div class="text-caption">Paid Orders</div>
          <div class="text-h6 font-weight-bold">{{ businessActivitySummary.paidOrdersCount }}</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="pa-4" color="success" variant="tonal">
          <div class="text-caption">New Customers</div>
          <div class="text-h6 font-weight-bold">{{ businessActivitySummary.newCustomersCount }}</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="pa-4" color="info" variant="tonal">
          <div class="text-caption">Average Order</div>
          <div class="text-h6 font-weight-bold">{{ businessActivitySummary.averageOrderValue }} €</div>
        </v-card>
      </v-col>
    </v-row>

    <div style="height: 400px;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </v-card>
</template>
