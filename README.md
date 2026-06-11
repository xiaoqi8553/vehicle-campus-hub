# Vehicle Campus Hub

2027届车辆行业招聘情报台，面向车辆工程、机械、自动化、控制、嵌入式、自动驾驶、三电、电池、热管理与智能座舱方向学生。

在线地址：<https://vehicle-campus-hub.vercel.app>

## 数据原则

1. 招聘官网存在不等于 2027 届项目已开放。
2. 没有可靠来源和人工核验时间，不发布精确日期。
3. 没有具体官方岗位 URL，不生成岗位卡片。
4. 企业业务方向仅作为准备参考，不冒充招聘岗位。
5. `example.com`、空地址、`#` 和不可解析地址不会渲染为链接。

## 当前数据

- 25 家车辆产业链企业
- 25 个官方招聘入口候选
- 3 个有明确 2027 届实习证据的官方项目
- 0 个未核验岗位
- 0 个未核验日历事件
- 6 份公共求职方法资料

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

## 页面

- `/`：数据快照、企业检索、已核验动态、证据规则
- `/companies`：企业情报列表与筛选
- `/companies/[id]`：官方项目、官方岗位、方向参考、证据台账
- `/calendar`：已核验时间线与企业观察清单
- `/resources`：公共求职方法资料
- `/about`：定位、来源规则、反馈与免责声明
- `/admin`：默认关闭并返回 404

版本变更见 [CHANGELOG.md](./CHANGELOG.md)，重构细节见 [REDESIGN_REPORT.md](./REDESIGN_REPORT.md)。
