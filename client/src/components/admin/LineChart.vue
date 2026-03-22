<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { Filler } from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
)

const props = defineProps({
  labels: Array,
  data: Array,
  label: String,
})

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.data,
      tension: 0.4,
      borderColor: props.label.includes('Venit') ? '#10b981' : '#6366f1',
      backgroundColor: props.label.includes('Venit')
        ? 'rgba(16, 185, 129, 0.2)'
        : 'rgba(99, 102, 241, 0.2)',
      fill: true,
      pointBackgroundColor: props.label.includes('Venit') ? '#10b981' : '#6366f1',
      pointRadius: 4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
}
// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: true,
//     },
//   },
//   scales: {
//     x: {
//       grid: {
//         display: false,
//       },
//     },
//     y: {
//       grid: {
//         color: '#f3f4f6',
//       },
//     },
//   },
// }
</script>

<style scoped></style>
