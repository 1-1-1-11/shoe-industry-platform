# 温州皮鞋工业制造平台

Vue 3 工业互联网应用系统前端技术期末大作业。项目基于 PPT 第 26 页之后的“温州皮鞋工业制造平台”完成，并按 Word 文件评分点补齐登录验证、组合式 API、Pinia、Vue Router 4、Element Plus、制造任务 CRUD、动态路由、可视化看板和项目文档。

## 运行方式

```powershell
pnpm install
pnpm start
```

`pnpm start` 会同时启动：

- 前端：http://localhost:5173
- JSON Server：http://localhost:3001/manufacturing

只运行前端也可以演示：

```powershell
pnpm dev
```

如果 JSON Server 未启动，系统会自动使用 `localStorage` 和 `src/data/seed.js` 种子数据，并在经营概览页显示提示。

## 登录账号

- 账号：`admin`
- 密码：`123456`

## 功能清单

- 登录验证、退出登录、登录状态持久化
- `beforeEach` 路由守卫和后台嵌套路由
- `/app/manufacturing/:id` 动态详情页
- Pinia 管理用户和制造任务状态
- Axios + JSON Server 模拟 REST API
- 制造任务新增、查询、编辑、删除、分页
- Element Plus 表单校验、弹窗、表格、加载状态
- ECharts 生产计划与完成情况可视化
- 制造清单 CSV 导出
- 质量管理和仓储物料扩展页面

## 提交材料

- 源码目录：`shoe-industry-platform`
- 设计文档 Markdown：`docs/项目设计文档.md`
- 设计文档 DOCX：`../outputs/温州皮鞋工业制造平台-项目设计文档.docx`
- 设计文档 PDF：`../outputs/温州皮鞋工业制造平台-项目设计文档.pdf`

## 验证命令

```powershell
pnpm build
```

当前构建已通过。Vite 会提示 ECharts 看板路由 chunk 较大，这是图表库体积导致；项目已用路由懒加载把它限制在经营概览页。
