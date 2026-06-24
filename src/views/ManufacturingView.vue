<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useManufacturingStore } from '../stores/manufacturing'
import ManufacturingTable from '../components/ManufacturingTable.vue'
import TaskForm from '../components/TaskForm.vue'

const router = useRouter()
const store = useManufacturingStore()
const { products, loading } = storeToRefs(store)
const dialogVisible = ref(false)
const editing = ref(null)
const page = ref(1)
const pageSize = 5
const filters = reactive({ keyword: '', status: '' })

const filtered = computed(() =>
  products.value.filter((item) => {
    const text = `${item.name}${item.model}${item.manager}${item.line}`
    return (!filters.keyword || text.includes(filters.keyword)) && (!filters.status || item.status === filters.status)
  }),
)

const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

const openCreate = () => {
  editing.value = null
  dialogVisible.value = true
}

const openEdit = (row) => {
  editing.value = { ...row }
  dialogVisible.value = true
}

const openDetail = (row) => {
  router.push(`/app/manufacturing/${row.id}`)
}

const saveTask = async (payload) => {
  if (editing.value?.id) {
    await store.updateProduct(editing.value.id, payload)
    ElMessage.success('制造任务已更新')
  } else {
    await store.addProduct(payload)
    ElMessage.success('制造任务已新增')
  }
  dialogVisible.value = false
}

const removeTask = async (row) => {
  await ElMessageBox.confirm(`确认删除 ${row.name}？`, '删除确认', { type: 'warning' })
  await store.removeProduct(row.id)
  ElMessage.success('已删除')
}

const exportCsv = () => {
  const header = ['编号', '产品', '型号', '数量', '完成', '生产线', '负责人', '状态', '交付日期']
  const body = filtered.value.map((item) =>
    [item.id, item.name, item.model, item.quantity, item.completed, item.line, item.manager, item.status, item.deadline].join(','),
  )
  const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'manufacturing.csv'
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  store.loadProducts()
})
</script>

<template>
  <div class="manufacturing">
    <div class="toolbar">
      <el-input v-model="filters.keyword" clearable placeholder="搜索产品、型号、负责人或产线" />
      <el-select v-model="filters.status" clearable placeholder="筛选状态">
        <el-option label="待排产" value="待排产" />
        <el-option label="生产中" value="生产中" />
        <el-option label="已完成" value="已完成" />
        <el-option label="延期风险" value="延期风险" />
      </el-select>
      <el-button @click="exportCsv">导出清单</el-button>
      <el-button type="primary" @click="openCreate">新增任务</el-button>
    </div>
    <ManufacturingTable :rows="paged" :loading="loading" @detail="openDetail" @edit="openEdit" @remove="removeTask" />
    <div class="pager">
      <el-pagination
        v-model:current-page="page"
        background
        layout="prev, pager, next, total"
        :total="filtered.length"
        :page-size="pageSize"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? '编辑制造任务' : '新增制造任务'"
      width="760px"
      class="task-dialog"
      destroy-on-close
    >
      <TaskForm :model-value="editing || undefined" @submit="saveTask" @cancel="dialogVisible = false" />
    </el-dialog>
  </div>
</template>
