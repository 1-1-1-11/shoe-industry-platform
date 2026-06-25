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
  tl.fromTo('.login-bg', { autoAlpha: 0, scale: 1.12, x: 34 }, { autoAlpha: 1, scale: 1, x: 0, duration: 1.05 })
    .from('.login-eyebrow', { autoAlpha: 0, y: 16 }, '-=0.5')
    .from('.login-hero h1', { autoAlpha: 0, y: 36, scale: 0.96 }, '-=0.46')
    .from('.login-hero p, .login-stack span', { autoAlpha: 0, x: -20, stagger: 0.08 }, '-=0.28')
    .from('.login-card', { autoAlpha: 0, y: 28, scale: 0.96, rotationY: -6, transformOrigin: '0% 50%', duration: 0.66 }, '-=0.3')
    .from('.login-card .el-form-item, .login-submit', { autoAlpha: 0, y: 12, stagger: 0.06, duration: 0.32 }, '-=0.28')
  gsap.to('.login-bg', { scale: 1.035, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
})
</script>

<template>
  <main ref="motionRoot" class="login-page">
    <div class="login-bg" aria-hidden="true"></div>
    <section class="login-hero">
      <p class="login-eyebrow">WENZHOU SHOE INDUSTRY</p>
      <h1>温州皮鞋工业制造平台</h1>
      <p class="login-copy">把生产排产、质量检验、仓储预警放在同一个制造现场看板里。</p>
      <div class="login-stack" aria-label="技术栈">
        <span>Vue 3</span>
        <span>Router 4</span>
        <span>Pinia</span>
        <span>Element Plus</span>
        <span>JSON Server</span>
      </div>
    </section>
    <section class="login-card">
      <p class="login-card-kicker">MANUFACTURING CONSOLE</p>
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
