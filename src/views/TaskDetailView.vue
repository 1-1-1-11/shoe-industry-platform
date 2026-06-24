<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useManufacturingStore } from '../stores/manufacturing'

const route = useRoute()
const router = useRouter()
const store = useManufacturingStore()
const task = computed(() => store.byId(route.params.id))

onMounted(() => {
  if (!store.products.length) store.loadProducts()
})
</script>

<template>
  <el-empty v-if="!task" description="没有找到该制造任务">
    <el-button type="primary" @click="router.push('/app/manufacturing')">返回清单</el-button>
  </el-empty>
  <div v-else class="detail-page">
    <el-button @click="router.back()">返回</el-button>
    <section class="detail-hero">
      <div>
        <span>{{ task.id }}</span>
        <h2>{{ task.name }}</h2>
        <p>{{ task.model }} · {{ task.category }} · {{ task.material }}</p>
      </div>
      <el-tag size="large" :type="task.status === '延期风险' ? 'danger' : 'success'">{{ task.status }}</el-tag>
    </section>
    <div class="detail-grid">
      <article>
        <span>生产进度</span>
        <el-progress type="dashboard" :percentage="Math.round((task.completed / task.quantity) * 100)" />
      </article>
      <article>
        <span>负责人</span>
        <strong>{{ task.manager }}</strong>
        <small>{{ task.line }}</small>
      </article>
      <article>
        <span>质量不良率</span>
        <strong>{{ task.defectRate }}%</strong>
        <small>{{ task.defectRate > 3 ? '需要质检复核' : '处于控制范围' }}</small>
      </article>
      <article>
        <span>仓储风险</span>
        <strong>{{ task.inventoryRisk }}</strong>
        <small>交付日期：{{ task.deadline }}</small>
      </article>
    </div>
  </div>
</template>
