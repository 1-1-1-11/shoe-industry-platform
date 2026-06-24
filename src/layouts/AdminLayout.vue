<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Monitor, Box, Goods, Checked, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

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
</script>

<template>
  <div class="admin-shell">
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
