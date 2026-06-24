<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useAuthStore } from '../stores/auth'
import { usePageMotion } from '../composables/usePageMotion'
import { Monitor, Box, Goods, Checked, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const shellRef = ref()

const menu = [
  { path: '/app/dashboard', label: '经营概览', icon: Monitor },
  { path: '/app/manufacturing', label: '制造清单', icon: Goods },
  { path: '/app/quality', label: '质量管理', icon: Checked },
  { path: '/app/inventory', label: '仓储物料', icon: Box },
]

const title = computed(() => route.meta.title || '温州皮鞋工业制造平台')
const subtitle = computed(() => route.meta.subtitle || '工业互联网应用系统前端技术')

const logout = () => {
  auth.logout()
  router.push('/login')
}

usePageMotion(shellRef, ({ gsap, reduceMotion }) => {
  if (reduceMotion) return

  const tl = gsap.timeline({ defaults: { duration: 0.62, ease: 'power3.out' } })
  tl.from('.sidebar', { autoAlpha: 0, x: -34 })
    .from('.brand-mark', { autoAlpha: 0, scale: 0.5, rotation: -18, ease: 'back.out(1.8)' }, '-=0.3')
    .from('.brand strong, .brand small', { autoAlpha: 0, x: -12, stagger: 0.04 }, '-=0.35')
    .from('.side-menu .el-menu-item', { autoAlpha: 0, x: -22, scale: 0.96, stagger: 0.07 }, '-=0.18')
    .from('.topbar > *', { autoAlpha: 0, y: -16, stagger: 0.08 }, '-=0.28')
    .from('.content-panel', { autoAlpha: 0, y: 24, scale: 0.985 }, '-=0.2')
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const page = shellRef.value?.querySelector('.content-panel > *')
    if (!page) return
    gsap.fromTo(
      page,
      { autoAlpha: 0, y: 22, scale: 0.985, rotationX: -4, transformOrigin: '50% 0%' },
      { autoAlpha: 1, y: 0, scale: 1, rotationX: 0, duration: 0.46, ease: 'power3.out', overwrite: 'auto' },
    )
  },
)
</script>

<template>
  <div ref="shellRef" class="admin-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">WZ</span>
        <div>
          <strong>温州鞋业</strong>
          <small>制造平台</small>
        </div>
      </div>
      <el-menu :default-active="route.path" router class="side-menu">
        <el-menu-item v-for="item in menu" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </aside>
    <main class="main-panel">
      <header class="topbar">
        <div>
          <p class="section-label">工业互联网应用系统</p>
          <h1>{{ title }}</h1>
          <span>{{ subtitle }}</span>
        </div>
        <div class="top-actions">
          <el-tag type="success">角色：{{ auth.role }}</el-tag>
          <el-button :icon="Fold" @click="logout">退出</el-button>
        </div>
      </header>
      <section class="content-panel">
        <RouterView />
      </section>
    </main>
  </div>
</template>
