<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

const chartData = {
  labels: [
    'Sales',
    'Administration',
    'Technology',
    'Customer Support',
    'Development',
    'Marketing',
  ],
  datasets: [
    {
      label: 'Allocated Budget',
      data: [5000, 7000, 12000, 11000, 15000, 14000],
      backgroundColor: 'rgba(66, 165, 245, 0.4)',
      borderColor: '#42A5F5',
      pointBackgroundColor: '#42A5F5',
      fill: true,
    },
    {
      label: 'Expected Spending',
      data: [4000, 9000, 15000, 15000, 13000, 11000],
      backgroundColor: 'rgba(102, 187, 106, 0.4)',
      borderColor: '#66BB6A',
      pointBackgroundColor: '#66BB6A',
      fill: true,
    },
    {
      label: 'Actual Spending',
      data: [5500, 5000, 12000, 15000, 8000, 6000],
      backgroundColor: 'rgba(255, 167, 38, 0.4)',
      borderColor: '#FFA726',
      pointBackgroundColor: '#FFA726',
      fill: true,
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
      text: 'Department Budget Comparison',
    },
  },
  scales: {
    r: {
      angleLines: {
        display: true,
      },
      suggestedMin: 0,
      suggestedMax: 16000,
    },
  },
}
</script>
