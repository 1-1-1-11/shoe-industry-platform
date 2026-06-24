<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useManufacturingStore } from '../stores/manufacturing'
import ProductionChart from '../components/ProductionChart.vue'

const store = useManufacturingStore()
const { products, loading, usingMock } = storeToRefs(store)

const cards = computed(() => [
  { label: '制造任务', value: store.total, suffix: '项' },
  { label: '生产中', value: store.inProgress, suffix: '项' },
  { label: '延期风险', value: store.delayed, suffix: '项' },
  { label: '总体完成率', value: store.completedRate, suffix: '%' },
])

const urgent = computed(() =>
  products.value
    .filter((item) => item.priority === '高' || item.status === '延期风险')
    .slice(0, 4),
)

onMounted(() => {
  store.loadProducts()
})
</script>

<template>
  <div v-loading="loading" class="dashboard">
    <el-alert
      v-if="usingMock"
      title="当前仅运行前端，系统已自动使用 localStorage 种子数据；执行 pnpm start 可启用 JSON Server 持久化。"
      type="warning"
      show-icon
      :closable="false"
    />
    <div class="metric-grid">
      <article v-for="card in cards" :key="card.label" class="metric-card">
        <span>{{ card.label }}</span>
        <strong>{{ card.value }}{{ card.suffix }}</strong>
      </article>
    </div>
    <div class="dashboard-grid">
      <section class="panel wide">
        <div class="panel-head">
          <h2>产能计划与完成情况</h2>
          <span>创新功能：ECharts 数据可视化</span>
        </div>
        <ProductionChart :products="products" />
      </section>
      <section class="panel">
        <div class="panel-head">
          <h2>交付提醒</h2>
          <span>高优先级和延期风险</span>
        </div>
        <el-skeleton v-if="loading" :rows="4" animated />
        <ul v-else class="task-list">
          <li v-for="item in urgent" :key="item.id">
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.line }} · {{ item.manager }}</span>
            </div>
            <el-tag :type="item.status === '延期风险' ? 'danger' : 'warning'">{{ item.status }}</el-tag>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
