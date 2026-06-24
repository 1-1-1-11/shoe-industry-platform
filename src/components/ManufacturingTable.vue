<script setup>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['detail', 'edit', 'remove'])

const progressOf = (row) => Math.round((row.completed / row.quantity) * 100)
</script>

<template>
  <el-table :data="rows" v-loading="loading" class="data-table" row-key="id">
    <el-table-column prop="id" label="编号" width="150" />
    <el-table-column prop="name" label="产品" min-width="150" />
    <el-table-column prop="model" label="型号" width="110" />
    <el-table-column prop="line" label="生产线" min-width="130" />
    <el-table-column prop="manager" label="负责人" width="100" />
    <el-table-column label="进度" min-width="160">
      <template #default="{ row }">
        <el-progress :percentage="progressOf(row)" />
      </template>
    </el-table-column>
    <el-table-column prop="deadline" label="交付日期" width="120" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status === '延期风险' ? 'danger' : row.status === '已完成' ? 'success' : 'primary'">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="240" fixed="right">
      <template #default="{ row }">
        <el-button text type="primary" @click="emit('detail', row)">详情</el-button>
        <el-button text @click="emit('edit', row)">编辑</el-button>
        <el-button text type="danger" @click="emit('remove', row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
