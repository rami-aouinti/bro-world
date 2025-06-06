<script setup lang="ts">
const option: {
  backgroundColor: string;
  yAxis: { axisTick: { show: boolean }; type: string }[];
  xAxis: {
    data: string[];
    axisTick: { alignWithLabel: boolean };
    type: string
  }[];
  grid: {
    top: number;
    left: string;
    bottom: string;
    right: string;
    containLabel: boolean
  };
  series: ({
    barWidth: string;
    stack: string;
    data: number[];
    name: string;
    type: string
  })[];
  tooltip: { axisPointer: { type: string }; trigger: string }
} = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    top: 20,
    left: '2%',
    right: '2%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: 'pageA',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [79, 52, 200, 334, 390, 330, 220],
    },
    {
      name: 'pageB',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [80, 52, 200, 334, 390, 330, 220],
    },
    {
      name: 'pageC',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [30, 52, 200, 334, 390, 330, 220],
    },
  ],
}
</script>

<template>
  <v-chart :option="option" autoresize />
</template>
