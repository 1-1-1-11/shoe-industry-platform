<script setup>
import { computed, ref } from 'vue'
import { usePageMotion } from '../composables/usePageMotion'

const inventoryRef = ref()

const materials = [
  {
    name: '头层牛皮',
    stock: 8600,
    safe: 5000,
    unit: '平方英尺',
    status: '正常',
    location: 'A-01 皮料恒温区',
    owner: '郑琪',
    inbound: 1200,
    outbound: 760,
    linked: '商务正装皮鞋',
    updated: '2026-06-24 09:20',
  },
  {
    name: '防滑橡胶底',
    stock: 1200,
    safe: 1800,
    unit: '双',
    status: '预警',
    location: 'B-04 成型备料区',
    owner: '周敏',
    inbound: 300,
    outbound: 680,
    linked: '防滑劳保鞋',
    updated: '2026-06-24 10:15',
  },
  {
    name: '飞织面料',
    stock: 4300,
    safe: 3000,
    unit: '米',
    status: '正常',
    location: 'C-02 面料架',
    owner: '林若',
    inbound: 900,
    outbound: 510,
    linked: '轻量运动休闲鞋',
    updated: '2026-06-24 11:05',
  },
  {
    name: '儿童鞋 EVA 中底',
    stock: 700,
    safe: 1000,
    unit: '双',
    status: '预警',
    location: 'B-02 中底暂存区',
    owner: '黄一鸣',
    inbound: 160,
    outbound: 420,
    linked: '儿童透气运动鞋',
    updated: '2026-06-24 11:40',
  },
]

const movements = [
  { time: '09:20', type: '入库', material: '头层牛皮', amount: '+1200 平方英尺', line: 'A1智能裁断线' },
  { time: '10:15', type: '出库', material: '防滑橡胶底', amount: '-680 双', line: 'C1成型线' },
  { time: '11:05', type: '入库', material: '飞织面料', amount: '+900 米', line: 'B2针车线' },
  { time: '11:40', type: '出库', material: '儿童鞋 EVA 中底', amount: '-420 双', line: 'D1备料线' },
]

const warningItems = computed(() => materials.filter((item) => item.status === '预警'))
const totalStock = computed(() => materials.reduce((sum, item) => sum + item.stock, 0))
const turnover = computed(() => materials.reduce((sum, item) => sum + item.outbound, 0))

usePageMotion(inventoryRef, ({ gsap, reduceMotion }) => {
  if (reduceMotion) return

  gsap
    .timeline({ defaults: { duration: 0.54, ease: 'power3.out' } })
    .from('.inventory-hero, .inventory-kpi', { autoAlpha: 0, y: 22, scale: 0.98, stagger: 0.08 })
    .from('.inventory-hero .el-tag', { autoAlpha: 0, x: 20, scale: 0.72, ease: 'back.out(1.8)' }, '-=0.36')
    .from('.material-card', { autoAlpha: 0, y: 24, rotationX: -8, transformOrigin: '50% 100%', stagger: 0.08 }, '-=0.2')
    .from('.inventory-panel', { autoAlpha: 0, y: 18, stagger: 0.08 }, '-=0.18')
  gsap.to('.inventory-hero .el-tag', { scale: 1.08, duration: 0.28, repeat: 1, yoyo: true, delay: 0.75, ease: 'power2.inOut' })
})
</script>

<template>
  <section ref="inventoryRef" class="inventory-page">
    <div class="inventory-hero">
      <div>
        <p class="section-label">鞋厂仓储实时台账</p>
        <h2>物料库存与安全线</h2>
        <span>按生产任务关联皮料、鞋底、面料和中底，预警项优先处理。</span>
      </div>
      <el-tag :type="warningItems.length ? 'danger' : 'success'">{{ warningItems.length }} 项预警</el-tag>
    </div>

    <div class="inventory-kpis">
      <article class="inventory-kpi">
        <span>物料种类</span>
        <strong>{{ materials.length }}</strong>
      </article>
      <article class="inventory-kpi">
        <span>库存合计</span>
        <strong>{{ totalStock.toLocaleString() }}</strong>
      </article>
      <article class="inventory-kpi">
        <span>今日出库</span>
        <strong>{{ turnover.toLocaleString() }}</strong>
      </article>
      <article class="inventory-kpi warning">
        <span>低于安全线</span>
        <strong>{{ warningItems.length }}</strong>
      </article>
    </div>

    <section class="inventory-grid">
      <article v-for="item in materials" :key="item.name" class="material-card" :class="{ warning: item.status === '预警' }">
        <div class="material-head">
          <div>
            <span>{{ item.name }}</span>
            <strong>{{ item.stock.toLocaleString() }} {{ item.unit }}</strong>
          </div>
          <el-tag :type="item.status === '预警' ? 'danger' : 'success'">{{ item.status }}</el-tag>
        </div>
        <el-progress :percentage="Math.min(100, Math.round((item.stock / item.safe) * 100))" :status="item.status === '预警' ? 'exception' : 'success'" />
        <div class="material-meta">
          <span>安全线：{{ item.safe.toLocaleString() }} {{ item.unit }}</span>
          <span>库位：{{ item.location }}</span>
          <span>负责人：{{ item.owner }}</span>
          <span>关联任务：{{ item.linked }}</span>
        </div>
      </article>
    </section>

    <div class="inventory-bottom">
      <section class="panel inventory-panel">
        <div class="panel-head">
          <h2>补料优先级</h2>
          <span>低于安全库存的物料</span>
        </div>
        <ul class="risk-list">
          <li v-for="item in warningItems" :key="item.name">
            <strong>{{ item.name }}</strong>
            <span>{{ item.stock }} / {{ item.safe }} {{ item.unit }} · {{ item.linked }}</span>
            <el-button size="small" type="danger" plain>补料</el-button>
          </li>
        </ul>
      </section>

      <section class="panel inventory-panel">
        <div class="panel-head">
          <h2>今日流转</h2>
          <span>入库 / 出库记录</span>
        </div>
        <ul class="movement-list">
          <li v-for="item in movements" :key="`${item.time}-${item.material}`">
            <time>{{ item.time }}</time>
            <strong>{{ item.type }}</strong>
            <span>{{ item.material }} {{ item.amount }}</span>
            <small>{{ item.line }}</small>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
