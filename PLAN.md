# Vehicle Campus Hub 开发计划

> 状态：已完成。最终验证结果见 `TEST_REPORT.md`。

## 2026-06-10 产品重构补充

- 产品定位更新为“2027届车辆行业校招信息聚合平台”。
- 首页改为 Hero、关键统计、今日重点、重点公司、快速筛选、最新更新结构。
- 公司库增加类型、2027届状态、方向、城市、可信度、官方链接筛选，以及最近更新、即将截止、已开启优先、官方核验优先、方向匹配排序。
- 公司详情删除示例文案，增加官方入口、最后核验时间、可信度说明和岗位方向分组。
- 校招日历增加 7 天截止、30 天截止、本月开启、待确认关注分组，事件显示来源、可信度和投递入口。
- 资源页改为“2027届车辆行业笔试面经资料库”，展示适用届别、来源年份、来源类型和方向标签。
- `/about` 新增项目定位、面向人群、来源说明、可信度规则、纠错方式、免责声明和后续计划。
- `/admin` 默认从导航隐藏，并通过 `middleware.ts` 在未设置 `ADMIN_ENABLED=true` 时返回 404。

## 目标

面向 2027 届车辆、机械、自动驾驶、嵌入式、三电与新能源方向学生，建设可本地运行并可继续扩展到微信小程序/App 的校招信息聚合产品。

## 技术方案

- Next.js App Router、TypeScript、Tailwind CSS
- Prisma ORM + SQLite
- React Server Components 负责数据读取，Client Components 负责筛选和后台交互
- Route Handlers 提供公司、校招、岗位、资料、日历事件 API
- Vitest 覆盖纯函数，Playwright 覆盖核心用户路径和移动端

## 页面模块

- `/`：行业 Hero、数据统计、搜索筛选、精选公司
- `/companies`：完整公司库、搜索、分类/状态/方向筛选、排序
- `/companies/[id]`：公司信息、校招项目、岗位、资料、日历、求职建议
- `/calendar`：近期事件分组
- `/resources`：资料搜索与筛选
- `/admin`：公司、校招项目、岗位、资料、日历事件管理与新增表单；生产默认关闭

## 数据模型

- `Company`：新增 `slug/shortName/type/vehicleDirections/campusRecruitmentWebsite/lastVerifiedAt/dataStatus`，数组字段以 JSON 字符串存储
- `Recruitment`：兼容 RecruitmentProgram 展示字段，新增 `targetYear/batch/sourceType/notes`
- `Job`：新增 `programId/majors/skills/matchScore`
- `Resource`：新增 `targetYear/sourceYear/sourceUrl/sourceType/tags/lastVerifiedAt`
- `CalendarEvent`：新增 `programId/sourceUrl/credibility`
- `User/Favorite`：为后续账号与收藏功能预留

## API

- `GET/POST /api/companies`
- `GET/PUT/DELETE /api/companies/[id]`
- `GET/POST /api/recruitments`
- `GET/POST /api/jobs`
- `GET/POST /api/resources`
- `GET/POST /api/calendar-events`

所有写接口进行必填字段校验，返回结构化 JSON 错误；前台数据库读取失败时显示错误状态，不白屏。

## 测试计划

- 单元测试：校招状态判断、数组序列化、适配度等级、求职建议
- 数据检查：迁移、seed、各表数量和关联查询
- 质量检查：`npm run lint`、`npm run build`
- E2E：六个页面、首页搜索和状态筛选、详情跳转、详情模块、移动端、空链接、API 失败展示
- 视觉检查：桌面与移动端检查导航、密度、层级、按钮、标签和后台表单

## 实施顺序

1. 初始化工程和测试配置
2. 先写核心函数测试并确认失败
3. 实现 Prisma schema、工具函数和 seed
4. 实现 API 与页面
5. 迁移和导入数据
6. 完成 lint、build、E2E 和真实浏览器检查
7. 修复问题并更新验收文档
