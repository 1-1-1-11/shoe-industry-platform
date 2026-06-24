# 性能与满分项自查记录

## 优化证据

- 优化前：使用 `app.use(ElementPlus)` 全量注册，生产构建主入口 `index` chunk 约 941.22 kB，gzip 约 303.74 kB。
- 优化后：改为在 `src/main.js` 手动注册实际使用的 Element Plus 组件和 `ElLoading` 指令，生产构建主入口 `index` chunk 约 501.56 kB，gzip 约 164.63 kB。
- 降幅：主入口未压缩体积减少约 439.66 kB，gzip 体积减少约 139.11 kB。

## Lighthouse 结果

测试对象：`pnpm build` 后的生产预览 `http://localhost:4173/login`。

- Lighthouse version：13.4.0
- Performance：0.94
- Accessibility：0.95
- Best Practices：1.00
- SEO：0.82
- First Contentful Paint：2.3s
- Largest Contentful Paint：2.6s
- Total Blocking Time：10ms
- Cumulative Layout Shift：0
- Speed Index：2.3s

结论：生产构建首屏关键指标低于 3 秒，满足课程评分中“首屏加载时间 < 3 秒”的高分要求。

## 已落地优化

- 路由懒加载：Login、Dashboard、Manufacturing、Detail、Quality、Inventory 均通过动态 import 加载。
- 组件拆分：TaskForm、ManufacturingTable、ProductionChart 从页面中拆出。
- Element Plus 手动按需注册：避免全量注册所有组件。
- ECharts 只在 Dashboard 路由中使用，不进入登录页首屏。
- 表格分页：制造清单默认 5 条/页。
- 本地兜底：JSON Server 不可用时使用 localStorage/seed 数据，减少演示阻塞。

## 剩余边界

- ECharts 仍然让 DashboardView chunk 较大；课程数据量下不影响交互。若继续优化，可按需导入 ECharts bar/grid/tooltip 模块。
- 本项目没有使用 CDN，因为课程提交更适合本地可复现安装；文档中说明了可作为后续部署优化。
