<script setup>
const batches = [
  { id: 'Q-2401', product: '商务正装皮鞋', sample: 80, pass: 78, issue: '胶线轻微溢胶', owner: '质检一组' },
  { id: 'Q-2402', product: '防滑劳保鞋', sample: 60, pass: 55, issue: '鞋底耐磨复测', owner: '质检二组' },
  { id: 'Q-2403', product: '女士通勤乐福鞋', sample: 70, pass: 69, issue: '无', owner: '质检一组' },
]
</script>

<template>
  <section class="panel">
    <div class="panel-head">
      <h2>质检批次</h2>
      <span>扩展模块：质检记录与异常闭环</span>
    </div>
    <el-table :data="batches" class="data-table">
      <el-table-column prop="id" label="批次" width="110" />
      <el-table-column prop="product" label="产品" />
      <el-table-column prop="sample" label="抽检数" width="100" />
      <el-table-column prop="pass" label="合格数" width="100" />
      <el-table-column prop="issue" label="异常说明" />
      <el-table-column prop="owner" label="负责人" width="120" />
    </el-table>
  </section>
</template>
