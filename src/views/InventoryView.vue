<script setup>
const materials = [
  { name: '头层牛皮', stock: 8600, safe: 5000, unit: '平方英尺', status: '正常' },
  { name: '防滑橡胶底', stock: 1200, safe: 1800, unit: '双', status: '预警' },
  { name: '飞织面料', stock: 4300, safe: 3000, unit: '米', status: '正常' },
  { name: '儿童鞋 EVA 中底', stock: 700, safe: 1000, unit: '双', status: '预警' },
]
</script>

<template>
  <section class="inventory-grid">
    <article v-for="item in materials" :key="item.name" class="material-card">
      <div>
        <span>{{ item.name }}</span>
        <strong>{{ item.stock }} {{ item.unit }}</strong>
      </div>
      <el-progress :percentage="Math.min(100, Math.round((item.stock / item.safe) * 100))" />
      <el-tag :type="item.status === '预警' ? 'danger' : 'success'">{{ item.status }}</el-tag>
    </article>
  </section>
</template>
