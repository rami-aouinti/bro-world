<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = {
  labels: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
  datasets: [
    {
      label: 'Weekly Written Articles',
      data: [320, 240, 149, 100, 59],
      backgroundColor: [
        '#42A5F5',
        '#66BB6A',
        '#FFA726',
        '#AB47BC',
        '#FF7043',
      ],
      hoverOffset: 10,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Weekly Written Articles',
    },
    tooltip: {
      enabled: true,
    },
  },
}
</script>

<template>
  <v-container fluid style="max-width: 600px; margin: auto;">
    <Pie :data="chartData" :options="chartOptions" />
  </v-container>
</template>
