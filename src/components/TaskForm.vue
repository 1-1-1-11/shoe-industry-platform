<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const form = reactive({})

const emptyForm = () => ({
  id: '',
  name: '',
  model: '',
  category: '男鞋',
  material: '',
  quantity: 1000,
  completed: 0,
  line: '',
  manager: '',
  deadline: '',
  status: '待排产',
  priority: '中',
  defectRate: 0,
  inventoryRisk: '正常',
})

watch(
  () => props.modelValue,
  (value) => Object.assign(form, emptyForm(), value),
  { immediate: true },
)

const rules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5A-Za-z0-9（）()·\-\s]{2,30}$/, message: '产品名称需为 2-30 位中英文或数字', trigger: 'blur' },
  ],
  model: [
    { required: true, message: '请输入型号', trigger: 'blur' },
    { pattern: /^[A-Z]{2,4}-\d{3,4}$/, message: '型号格式示例：OX-918', trigger: 'blur' },
  ],
  line: [
    { required: true, message: '请输入生产线', trigger: 'blur' },
    { pattern: /^[A-Z]\d[\u4e00-\u9fa5A-Za-z0-9]+$/, message: '生产线格式示例：A1智能裁断线', trigger: 'blur' },
  ],
  manager: [
    { required: true, message: '请输入负责人', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '负责人请输入 2-6 位中文姓名', trigger: 'blur' },
  ],
  deadline: [{ required: true, message: '请选择交付日期', trigger: 'change' }],
  quantity: [{ type: 'number', min: 1, message: '计划数量必须大于 0', trigger: 'change' }],
  completed: [{ type: 'number', min: 0, message: '完成数量不能为负数', trigger: 'change' }],
}

const submit = async () => {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  emit('submit', { ...form })
}
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="96px" class="task-form">
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="如 商务正装皮鞋" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="如 OX-918" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" class="full">
            <el-option label="男鞋" value="男鞋" />
            <el-option label="女鞋" value="女鞋" />
            <el-option label="童鞋" value="童鞋" />
            <el-option label="功能鞋" value="功能鞋" />
            <el-option label="运动休闲" value="运动休闲" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="材质" prop="material">
          <el-input v-model="form.material" placeholder="材料结构" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="计划数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" class="full" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="完成数量" prop="completed">
          <el-input-number v-model="form.completed" :min="0" :max="form.quantity" class="full" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="生产线" prop="line">
          <el-input v-model="form.line" placeholder="如 A1智能裁断线" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="form.manager" placeholder="负责人姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="交付日期" prop="deadline">
          <el-date-picker v-model="form.deadline" value-format="YYYY-MM-DD" type="date" class="full" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" class="full">
            <el-option label="待排产" value="待排产" />
            <el-option label="生产中" value="生产中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="延期风险" value="延期风险" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="form.priority">
            <el-radio-button value="高">高</el-radio-button>
            <el-radio-button value="中">中</el-radio-button>
            <el-radio-button value="低">低</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="不良率">
          <el-input-number v-model="form.defectRate" :min="0" :max="100" :precision="1" class="full" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="库存风险">
          <el-input v-model="form.inventoryRisk" placeholder="如 正常 / 鞋底偏低 / 面料待检" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="form-actions">
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="primary" @click="submit">保存任务</el-button>
    </div>
  </el-form>
</template>
