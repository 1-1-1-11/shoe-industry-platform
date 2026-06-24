<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { usePageMotion } from '../composables/usePageMotion'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const formRef = ref()
const motionRoot = ref()
const loading = ref(false)
const form = reactive({ username: 'admin', password: '123456', remember: true })

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}

const submit = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    auth.login(form)
    router.push(route.query.redirect || '/app/dashboard')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

usePageMotion(motionRoot, ({ gsap, reduceMotion }) => {
  if (reduceMotion) return

  const tl = gsap.timeline({ defaults: { duration: 0.72, ease: 'power3.out' } })
  tl.from('.factory-grid span', {
    autoAlpha: 0,
    y: 22,
    scale: 0.45,
    rotation: () => gsap.utils.random(-18, 18),
    stagger: { amount: 0.52, from: 'random' },
  })
    .from('.login-hero h1', { autoAlpha: 0, y: 36, scale: 0.96 }, '-=0.24')
    .from('.login-hero p, .login-hero li', { autoAlpha: 0, x: -20, stagger: 0.08 }, '-=0.28')
    .from('.login-card', { autoAlpha: 0, y: 34, scale: 0.94, rotationX: -7, transformOrigin: '50% 100%', duration: 0.66 }, '-=0.36')
})
</script>

<template>
  <main ref="motionRoot" class="login-page">
    <section class="login-hero">
      <div class="factory-grid">
        <span v-for="i in 18" :key="i"></span>
      </div>
      <h1>温州皮鞋工业制造平台</h1>
      <p>面向鞋业工厂的生产任务、质量和仓储一体化管理后台。</p>
      <ul>
        <li>Vue 3 + Router 4 + Pinia</li>
        <li>Element Plus 表单与表格</li>
        <li>JSON Server REST 模拟接口</li>
      </ul>
    </section>
    <section class="login-card">
      <h2>管理员登录</h2>
      <p>课堂演示账号：admin / 123456</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" size="large" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" size="large" type="password" show-password autocomplete="current-password" />
        </el-form-item>
        <el-checkbox v-model="form.remember">记住登录状态</el-checkbox>
        <el-button type="primary" size="large" :loading="loading" class="login-submit" @click="submit">
          进入后台
        </el-button>
      </el-form>
    </section>
  </main>
</template>
