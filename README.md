# Vehicle Campus Hub

车辆行业校招信息汇总平台，面向车辆、机械、自动驾驶、嵌入式、三电与新能源方向学生。项目聚合企业、校招项目、岗位、资料和日历事件，并提供可供后续微信小程序或 App 复用的 REST API。

在线演示：[https://vehicle-campus-hub.vercel.app](https://vehicle-campus-hub.vercel.app)

GitHub 仓库：[https://github.com/xiaoqi8553/vehicle-campus-hub](https://github.com/xiaoqi8553/vehicle-campus-hub)

> 本平台信息为聚合整理，具体以企业官方招聘网站为准。当前 seed 数据用于产品演示，不代表实时招聘状态。

## 项目亮点

1. 车辆行业垂直校招聚合，覆盖整车、零部件、自动驾驶、电池三电和智能化供应商。
2. 为车辆研究生提供岗位适配度评分和技能准备建议。
3. 根据日期与来源文本自动判断校招状态。
4. 对官方信息、公开整理和经验资料进行可信度区分。
5. 数据层和 API 可继续复用到微信小程序与移动应用。

## 技术栈

- Next.js 15 App Router
- React 19 + TypeScript 5.9
- Tailwind CSS 3 + 自定义工业仪表盘视觉系统
- Prisma 6 + SQLite
- Zod 请求校验
- Vitest 单元测试
- Playwright Chromium 桌面端与移动端 E2E

## 本地运行

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

浏览器打开 `http://localhost:3000`。

生产模式：

```bash
npm run build
npm run start
```

## 数据库初始化

SQLite 文件位于 `prisma/dev.db`，连接配置来自 `.env`：

```env
DATABASE_URL="file:./dev.db"
```

重新导入演示数据会清空并重建业务表数据：

```bash
npm run prisma:seed
```

seed 包含 25 家企业、25 个校招项目、50 个岗位、50 份资料和 25 个日历事件。

## 页面功能

- `/`：行业 Hero、统计、公司搜索与筛选
- `/companies`：公司库、类型/状态/方向筛选和排序
- `/companies/[id]`：公司基础信息、校招、岗位、资料、事件与求职建议
- `/calendar`：按时间窗口分组的校招事件
- `/resources`：资料搜索、公司/类型/可信度筛选
- `/admin`：公司、校招项目、岗位和资料的新增与核心字段编辑；公司支持删除

## API

- `GET/POST /api/companies`
- `GET/PUT/DELETE /api/companies/[id]`
- `GET/POST /api/recruitments`
- `PUT/DELETE /api/recruitments/[id]`
- `GET/POST /api/jobs`
- `PUT/DELETE /api/jobs/[id]`
- `GET/POST /api/resources`
- `PUT/DELETE /api/resources/[id]`
- `GET/POST /api/calendar-events`

列表 API 可通过 `companyId` 查询关联数据；公司列表还支持 `q`、`status`、`category` 参数。

## 测试

```bash
npm run lint
npm run build
npm run test:unit
npx playwright install chromium --no-shell
npm run test:e2e
```

Playwright 同时运行 Desktop Chrome 和 Pixel 7 视口，覆盖搜索、状态筛选、详情跳转、六个核心页面、空链接、API 参数错误、后台表单写入/更新/清理，以及全页横向溢出检查。

## 小程序扩展规划

1. 将当前 Route Handlers 作为统一数据 API，增加版本前缀和鉴权。
2. SQLite 切换为 PostgreSQL，Prisma 模型和业务查询可继续复用。
3. 增加用户登录、收藏、订阅提醒和信息纠错工作流。
4. 微信小程序端按公司库、日历、资料和收藏拆分页面，复用状态、可信度和建议生成规则。
