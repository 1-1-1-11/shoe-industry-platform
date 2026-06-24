<script setup>
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
})

const chartRef = ref()
let chart

const renderChart = () => {
  if (!chartRef.value) return
  chart ||= echarts.init(chartRef.value)
  const names = props.products.map((item) => item.model)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 32, right: 20, top: 24, bottom: 28 },
    xAxis: { type: 'category', data: names, axisTick: { show: false } },
    yAxis: { type: 'value' },
    series: [
      {
        name: '计划数量',
        type: 'bar',
        data: props.products.map((item) => item.quantity),
        itemStyle: { color: '#2563eb', borderRadius: [6, 6, 0, 0] },
      },
      {
        name: '完成数量',
        type: 'bar',
        data: props.products.map((item) => item.completed),
        itemStyle: { color: '#14b8a6', borderRadius: [6, 6, 0, 0] },
      },
    ],
  })
}

const resize = () => chart?.resize()

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})

watch(() => props.products, renderChart, { deep: true })
</script>

<template>
  <div ref="chartRef" class="chart"></div>
</template>
