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

// Exemple de labels et datasets pour un stacked bar chart
const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Page A',
      data: [79, 52, 200, 334, 390, 330, 220],
      backgroundColor: '#42A5F5',
      stack: 'visitors',
    },
    {
      label: 'Page B',
      data: [80, 52, 200, 334, 390, 330, 220],
      backgroundColor: '#66BB6A',
      stack: 'visitors',
    },
    {
      label: 'Page C',
      data: [30, 52, 200, 334, 390, 330, 220],
      backgroundColor: '#FFA726',
      stack: 'visitors',
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
    title: {
      display: true,
      text: 'Stacked Visitors per Day',
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}
</script>

<template>
  <v-container fluid style="height: 400px">
    <Bar :data="chartData" :options="chartOptions" />
  </v-container>
</template>
