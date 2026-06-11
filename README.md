# Vehicle Campus Hub

面向车辆工程、机械、自动化、控制、嵌入式、自动驾驶、三电、电池、热管理与智能座舱方向学生的 **2027 届车辆行业校招情报平台**。

[在线访问](https://vehicle-campus-hub.vercel.app) · [产品重构报告](./REDESIGN_REPORT.md) · [竞品研究](./BENCHMARK.md) · [测试报告](./TEST_REPORT.md)

![Vehicle Campus Hub 首页](./docs/redesign/2026-06-11/after-home-chromium.png)

## 核心能力

- 搜索公司、城市和车辆技术方向。
- 区分 2027 届具体项目、校园招聘门户、通用招聘官网、官方公告和企业官网。
- 显示官方域名、面向届次、最后核验时间、链接健康状态和证据摘要。
- 明确区分“项目已开放但未公布截止日期”和“尚未发布 2027 项目”。
- 提供自动驾驶、嵌入式、底盘、三电、电池、热管理等完整求职资料。
- Desktop、iPad、iPhone 14 和 iPhone SE 响应式支持。

## 数据原则

1. 招聘官网存在不等于 2027 届项目已开放。
2. 没有可靠来源和人工核验时间，不发布精确日期。
3. 没有具体官方岗位 URL，不生成岗位卡片。
4. 企业业务方向仅作为准备参考，不冒充招聘岗位。
5. `example.com`、空地址、`#` 和不可解析地址不会渲染为链接。

## 当前数据

- 25 家车辆产业链企业
- 51 条浏览器核验链接证据
- 20 个可用主入口
- 3 个有明确 2027 届实习证据的官方项目
- 1 条已确认失效链接
- 6 份包含完整正文、目录和检查清单的平台资料

链接健康状态包含：可正常访问、仅浏览器可访问、被反爬拦截、已重定向、已失效和待人工确认。

## 页面

| 路由 | 功能 |
| --- | --- |
| `/` | 搜索、明确开放项目、最近核验变化 |
| `/companies` | 企业情报列表、排序、基础与高级筛选 |
| `/companies/[id]` | 项目判断、来源证据、岗位方向和 FAQ |
| `/calendar` | 开放但无截止日期项目、未发布观察名单 |
| `/resources` | 车辆方向求职资料索引 |
| `/resources/[id]` | 完整资料正文与目录 |
| `/about` | 数据规则、免责声明和纠错入口 |
| `/admin` | 默认关闭，生产环境返回 404 |

## 数据模型

核心实体：

- `Company`
- `CompanyLink`
- `Recruitment`
- `Job`
- `Resource`
- `CalendarEvent`

`CompanyLink` 独立保存链接类型、目标届次、最终 URL、HTTP 状态、健康状态、核验时间和证据摘要。通用招聘官网不会被自动视为 2027 届项目开放证据。

## 技术栈

- Next.js 15 / React 19 / TypeScript
- Prisma 6 / SQLite
- Vitest / Playwright
- Vercel

## 本地启动

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

访问 `http://localhost:3000`。

## 验证

```bash
npm run test:unit
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

当前基线：

- Unit：13/13
- Playwright：50 passed / 2 intentional skipped
- TypeScript：通过
- ESLint：通过
- Production build：通过

## 项目结构

```text
app/                 Next.js 页面与 API
components/          公司、资源、布局和通用组件
lib/                 数据序列化、证据规则和 Prisma 客户端
prisma/              Schema、迁移、seed 和 SQLite 数据
tests/unit/           证据与领域规则测试
tests/e2e/            页面、交互、移动端与视觉验证
docs/benchmarks/      竞品研究截图
docs/audit/           浏览器链接核验结果
docs/redesign/        重构前后截图
```

版本变化见 [CHANGELOG.md](./CHANGELOG.md)。
