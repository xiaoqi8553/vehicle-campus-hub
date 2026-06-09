# Vehicle Campus Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可运行、可管理、可测试的车辆行业校招信息聚合网站 MVP。

**Architecture:** Next.js App Router 单体应用通过 Prisma 访问 SQLite；服务端页面读取聚合数据，客户端组件承担搜索筛选和管理表单；Route Handlers 提供可被未来小程序复用的 JSON API。

**Tech Stack:** Next.js、React、TypeScript、Tailwind CSS、Prisma、SQLite、Vitest、Playwright

---

### Task 1: 工程与测试基线

**Files:**
- Create: `package.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/domain.test.ts`
- Create: `tests/e2e/main.spec.ts`

- [ ] 写核心领域函数单元测试和六页 E2E 验收测试。
- [ ] 运行测试并确认因实现缺失而失败。
- [ ] 配置 Next.js、TypeScript、Tailwind、Vitest 和 Playwright。

### Task 2: 数据层与领域函数

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/prisma.ts`
- Create: `lib/constants.ts`
- Create: `lib/domain.ts`
- Create: `lib/data.ts`

- [ ] 实现状态判断、JSON 数组转换、适配度等级和建议生成。
- [ ] 运行单元测试并确认通过。
- [ ] 定义七个 Prisma 模型及关系。
- [ ] 创建至少 25 家公司及关联校招、岗位、资料、日历 seed。

### Task 3: API

**Files:**
- Create: `app/api/companies/route.ts`
- Create: `app/api/companies/[id]/route.ts`
- Create: `app/api/recruitments/route.ts`
- Create: `app/api/jobs/route.ts`
- Create: `app/api/resources/route.ts`
- Create: `app/api/calendar-events/route.ts`

- [ ] 实现列表查询、筛选和创建。
- [ ] 实现公司详情、修改和删除。
- [ ] 对写请求执行校验并返回明确错误。

### Task 4: 公共界面

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `app/companies/page.tsx`
- Create: `app/companies/[id]/page.tsx`
- Create: `app/calendar/page.tsx`
- Create: `app/resources/page.tsx`
- Create: `components/*`

- [ ] 实现行业化导航、Hero、统计卡片和响应式布局。
- [ ] 实现公司搜索、筛选和排序。
- [ ] 实现公司详情全部模块。
- [ ] 实现日历分组和资料筛选。
- [ ] 为加载、空数据、错误和空链接提供安全状态。

### Task 5: 后台管理

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/admin-dashboard.tsx`

- [ ] 实现四类管理区和数据概览。
- [ ] 实现基础校验、新增提交、成功和错误提示。
- [ ] 验证移动端表格与表单可用。

### Task 6: 数据库与质量检查

- [ ] 运行 `npm install`。
- [ ] 运行 `npm run prisma:generate`。
- [ ] 运行 `npm run prisma:migrate`。
- [ ] 运行 `npm run prisma:seed`。
- [ ] 查询数据库确认各业务表和关联数据。
- [ ] 运行 `npm run lint`、`npm run build`，修复后重跑。

### Task 7: 浏览器验收与文档

- [ ] 安装 Playwright Chromium 并运行 `npm run test:e2e`。
- [ ] 在桌面与移动视口检查六个页面并修复视觉问题。
- [ ] 更新 `CHECKLIST.md`。
- [ ] 创建 `TEST_REPORT.md`。
- [ ] 完善 `README.md` 和本地启动步骤。
