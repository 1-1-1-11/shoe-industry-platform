import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const AdminLayout = () => import('../layouts/AdminLayout.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/app/dashboard' },
    { path: '/dashboard', redirect: '/app/dashboard' },
    { path: '/manufacturing', redirect: '/app/manufacturing' },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true, title: '登录' },
    },
    {
      path: '/app',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: '经营概览', subtitle: '生产、质量、交付指标集中看板' },
        },
        {
          path: 'manufacturing',
          name: 'manufacturing',
          component: () => import('../views/ManufacturingView.vue'),
          meta: { title: '制造清单', subtitle: '制造任务 CRUD 与进度追踪' },
        },
        {
          path: 'manufacturing/:id',
          name: 'manufacturing-detail',
          component: () => import('../views/TaskDetailView.vue'),
          meta: { title: '任务详情', subtitle: '动态路由参数匹配示例' },
        },
        {
          path: 'quality',
          name: 'quality',
          component: () => import('../views/QualityView.vue'),
          meta: { title: '质量管理', subtitle: '质检批次与异常闭环' },
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../views/InventoryView.vue'),
          meta: { title: '仓储物料', subtitle: '关键物料库存与风险预警' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthed) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthed) return '/app/dashboard'
})

export default router
