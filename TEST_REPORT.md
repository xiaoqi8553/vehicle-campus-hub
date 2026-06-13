# Vehicle Campus Hub 测试报告

## 2026-06-11 工程治理与 PostgreSQL 迁移

### 已完成

- 创建并推送稳定基线 tag `v2.1.0`，对应 commit `f3480ca`。
- 建立 `codex/project-governance` 功能分支和 Conventional Commits 规范。
- 新增 PostgreSQL 16 CI，覆盖 migration、seed、数据校验、格式、lint、typecheck、unit、build 和完整 E2E。
- Prisma datasource 从 SQLite 改为 PostgreSQL，旧 migrations 移入只读归档。
- `prisma/dev.db` 已停止 Git 跟踪，本地文件仍保留用于一次性数据迁移。
- 新增 SQLite→PostgreSQL 迁移、数量/关联校验、Neon 恢复点和生产 smoke 工具。
- 新增 Release Please、CodeQL、Dependabot、每周外链巡检和部署标签工作流。
- 新增 `/api/health`，用于校验生产版本、commit 和部署环境。
- 新增贡献、发布、回退、安全和 ADR 文档。

### 自动验证

| 检查                          | 结果       |
| ----------------------------- | ---------- |
| GitHub Actions CI             | 通过       |
| PostgreSQL baseline migration | 通过       |
| PostgreSQL seed               | 通过       |
| 数据库数量与关联校验          | 通过       |
| UTF-8 / BOM 校验              | 通过       |
| Prettier                      | 通过       |
| ESLint                        | 通过       |
| TypeScript                    | 通过       |
| Unit                          | 13/13 通过 |
| Next.js build                 | 通过       |
| Playwright E2E                | 通过       |

CI run：<https://github.com/xiaoqi8553/vehicle-campus-hub/actions/runs/27359454683>

首次 CI 在 `prisma migrate deploy` 失败，根因是 `migration_lock.toml` 带 UTF-8 BOM。去除 BOM 并把 BOM 检查加入 `check:utf8` 后，第二次 CI 全部通过。

### 待账户授权

- GitHub CLI 尚未登录，因此 GitHub Release、PR 创建和 `main` Ruleset 尚未完成。
- Vercel 账户尚未添加 GitHub Login Connection，因此项目不能绑定 Git 自动 Preview/Production。
- Neon Marketplace 条款尚未由账户所有者确认，因此尚未创建生产 PostgreSQL、迁移生产数据或执行 Neon 回退演练。
- 在上述授权完成前，不部署 PostgreSQL 版本到生产，避免当前线上站点因缺少 `DATABASE_URL` 中断。

## 2026-06-11 2.0 结构重构

### 原有问题

1. 首页重复展示企业卡片，移动端滚动过长。
2. seed 为每家企业生成模板岗位、重复资料和空日期日历事件。
3. 招聘官网与 2027 届项目状态混用，容易把“有入口”误解为“已开放”。
4. 公司详情的业务方向看起来像真实岗位。
5. 当前视觉偏营销卡片和后台面板，不符合可信情报工具定位。

### 最终数据

- 企业：25
- 官方招聘入口候选：25
- 浏览器直接可访问并复核：20
- 明确 2027 届实习项目：3
- 具体岗位：0
- 公共资料：6
- 已核验日历事件：0

### 页面验证

- 首页只显示 8 条企业结果，无重点企业重复模块。
- 公司库显示 25 条紧凑记录并支持搜索、筛选和排序。
- 公司详情分开显示官方项目、官方岗位和方向参考。
- 日历显示“暂无已核验招聘日程”和 25 家观察清单，不显示伪精确日期。
- 资源页只显示 6 份唯一公共资料，无企业重复模板。
- `/about` 正常；`/admin` 默认返回 404。
- 四种视口无横向滚动，每页只有一个 `h1`，无 `example.com` 或空链接。

### 验证结果

- `npm run prisma:seed`：通过
- `npm run test:unit`：通过，11/11
- `npm run test:e2e`：通过，35 passed / 1 intentional skip
- `npm run lint`：通过
- `npm run typecheck`：通过
- `npm run build`：通过

### 待人工补充

- 22 家企业的明确 2027 届项目证据。
- 25 家企业的可靠开始/截止日期。
- 带具体岗位 URL 的官方岗位。
- 5 个访问受限或超时招聘入口的再次核验。

### 生产部署

- 正式 URL：<https://vehicle-campus-hub.vercel.app>
- 应用 commit：`0457f71daed9345a1620e22bc5e20ac5b7e40b7f`
- 部署 ID：`dpl_6yzf76anugbdDb5gsos19sCfNwgg`
- 部署时间：2026-06-11 11:06:00（中国标准时间）
- Vercel 状态：Ready
- 线上验证：Desktop 1440、iPhone SE、iPhone 14、iPad 全部无横向滚动、每页一个 H1、无 page error、严重 console error 或假链接。
- 线上数据：首页 8 条企业、公司库 25 条、日历正式事件 0 条、观察清单 25 条、公共资料 6 条。
- `/admin`：HTTP 404。

## 2026-06-10 可信校招工具重构

### 原有问题

1. 首页重点公司后又完整渲染 25 家企业，移动端基线有 39 个 `article`，与公司库重复。
2. 日历把同一事件同时放入时间分组和待确认分组，并显示未核验 seed 精确日期。
3. 数据模型缺少统一来源类型、核验时间、日期可信度和变化摘要。
4. 公司详情展示 82、92 等无计算解释的匹配分数。
5. 首页“查看”链接基线热区约 `26×20px`，部分按钮不足 44px。

### 数据模型变更

迁移：`20260610124753_evidence_model`

- `Company`、`Recruitment`、`Job`、`Resource`、`CalendarEvent` 补充 `sourceUrl`、`sourceType`、`verifiedAt`、`dateConfidence`、`changeSummary`。
- `sourceType` 统一为 `OFFICIAL / SCHOOL / PUBLIC / EXPERIENCE / UNKNOWN`。
- `dateConfidence` 统一为 `VERIFIED / ESTIMATED / UNKNOWN`。
- `CalendarEvent.eventDate` 改为可空，兼容现有 SQLite 数据并允许真实表达“日期待确认”。
- 无有效来源的记录在序列化层统一降级为待核实；`example.com`、`#`、空值、本地地址和非法 URL 继续被拦截。

### 首页信息架构

- 重点企业固定最多 6 家，并优先展示已核验或已有招聘入口的企业。
- 快速筛选最多展示 6 家，新增“查看全部 N 家企业”，跳转 `/companies` 时保留搜索和筛选参数。
- 最新更新只读取有 `changeSummary` 的 5 条记录，分别展示变化摘要、内容更新时间和最后核验时间。
- 移动端首页从基线 39 个 `article` 降为 20 个，不再渲染完整 25 家公司列表。

### 日历规则

- 正式时间线的 7 天截止、30 天截止、本月开启互斥，同一 `CalendarEvent.id` 只出现一次。
- 只有有效来源、可靠来源类型、`dateConfidence=VERIFIED` 且存在 `verifiedAt` 的事件可进入正式时间线。
- 其他记录按企业去重进入“待核实观察清单”，显示“日期待确认”，不渲染 `<time>` 或精确事件日期。
- 没有来源链接的事件继续显示禁用状态，不生成可点击来源按钮。
- 当前 seed 的 25 条日历记录全部为待核实，未核验但带精确日期的数据库记录为 0。

### 岗位相关度

- 删除页面上的精确匹配分数。
- 改为“车辆方向相关度参考”：高相关 / 中相关 / 低相关。
- 评分依据明确展示为岗位方向匹配、专业相关度、车辆工程关键词、技能匹配。
- 页面明确说明“仅为平台规则参考，不代表录用概率”。
- seed 中原随机分数停止生成，旧字段保留用于迁移兼容。

### 数据与来源审计

| 检查项             | 结果 |
| ------------------ | ---: |
| 公司               |   25 |
| 校招跟踪项目       |   25 |
| 岗位方向参考       |   75 |
| 资料               |   50 |
| 日历观察记录       |   25 |
| 已核验可达招聘入口 |    3 |
| 缺少招聘入口       |   20 |
| 有入口但需重新核验 |    2 |
| 未核验精确日历日期 |    0 |
| 已核验官方资源     |    3 |

真实浏览器复核：小米、比亚迪、博世招聘入口可正常打开；宁德时代当前网络连接关闭，电装返回 403，因此后两者已撤销人工核验时间，保留为待核实入口。

### 四种视口

| 视口                | 横向滚动 | 主要操作热区 | 页面错误 |
| ------------------- | -------- | ------------ | -------- |
| iPhone SE `375×667` | 无       | ≥44px        | 无       |
| iPhone 14 `390×844` | 无       | ≥44px        | 无       |
| iPad `820×1180`     | 无       | 通过         | 无       |
| Desktop `1440×1000` | 无       | 通过         | 无       |

覆盖页面：`/`、`/companies`、`/companies/xiaomi-auto`、`/calendar`、`/resources`。筛选控件均有可访问名称，`focus-visible` 清晰，未发现 hydration error、page error、严重 console error 或非预期失败请求。

### 最终命令结果

- `npm run prisma:seed`：通过
- `npm run test:unit`：通过，`11/11`
- `npm run test:e2e`：通过，`55 passed / 1 intentional skip`
- `npm run lint`：通过
- `npm run typecheck`：通过
- `npm run build`：通过

Playwright 并发固定为 4、单测试超时 60 秒，避免 8 worker 同时压开发服务器导致偶发 Next.js 开发缓存读取中断。

### 仍需人工补充

1. 20 家企业完全缺少校招招聘入口。
2. 宁德时代、电装已有官方域名候选，但当前可达性检查未通过，需要换网络或人工浏览器重新核验。
3. 25 家企业的 2027 届批次、开始/截止日期和具体岗位均未获得可靠证据，继续保持待确认。
4. 本轮改动已在本地完成，线上地址仍是此前部署版本，尚未执行新的 Git 提交或 Vercel 部署。

## 2026-06-10 全站产品重构验证

本次重构将站点定位调整为“2027届车辆行业校招信息聚合平台”，并覆盖首页、公司库、公司详情、校招日历、资源页、关于页和后台守卫。

### 参考站信息架构提炼

1. 牛客校招日程适合参考日程分组、即将截止、24h 更新、行业/城市筛选、届别标签和官网投递入口；本项目保留这些信息维度，但降低列表密度。
2. 应届生求职网适合参考校招信息、宣讲会、招聘会和实习信息的覆盖范围；本项目先聚焦校招与日历事件，后续可扩展宣讲会。
3. 实习僧适合参考实习/校招/公司入口和岗位分类；本项目将岗位方向拆成自动驾驶、嵌入式、底盘、整车研发、三电、电池、热管理、智能座舱、测试验证。
4. High投、Offer情报局、求职方舟适合参考每日更新、进度管理和轻量汇总表；本项目用最近更新、可信度、待补链接和纠错入口承接。
5. 蔚来、比亚迪、小鹏、理想等官方校招站适合参考校招项目、投递入口、校招指南、行程、FAQ 和岗位方向分类；本项目在公司详情页增加流程、来源、FAQ 和官方入口。
6. Simplify Jobs 适合参考职位匹配、简历工具和投递看板；本项目先保留求职准备建议和投递进度入口，后续扩展个人看板。

### 本次修复

1. 首页改为“2027届车辆行业校招雷达”，增加关键统计、今日重点、重点公司、快速筛选和最新更新。
2. 公司库增加公司类型、2027届状态、岗位方向、城市、可信度、是否有官方链接筛选，以及五种排序。
3. 公司详情删除 Demo 文案，新增最后核验时间、信息可信度说明、2027届项目字段和岗位方向分组。
4. 校招日历使用真实当前日期分组，事件显示来源链接、可信度、投递入口；缺来源时显示待核验。
5. 资源页改为“2027届车辆行业笔试面经资料库”，展示适用届别、来源年份、来源类型和资源标签。
6. 新增 `/about`，说明项目定位、面向人群、信息来源、可信度规则、纠错反馈、免责声明和后续计划。
7. `/admin` 默认从导航隐藏，并通过 middleware 在未设置 `ADMIN_ENABLED=true` 时返回 404。
8. Prisma schema 增加 `slug/shortName/type/vehicleDirections/campusRecruitmentWebsite/lastVerifiedAt/dataStatus/targetYear/sourceType/tags/credibility` 等字段。
9. seed 保留 25 家企业，但不再使用 `example.com`；未核验投递入口留空，并由 UI 显示“待补官方链接/待补充”。
10. 首页新增“校招日程、24h 更新视角、投递进度管理”入口。
11. 公司详情页新增 FAQ。
12. 资源页新增车辆方向分组快捷筛选。

### 数据审计

| 检查项                 | 结果 |
| ---------------------- | ---: |
| 公司                   |   25 |
| 2027届校招项目         |   25 |
| 岗位                   |   75 |
| 资源                   |   50 |
| 日历事件               |   25 |
| 有校招/投递入口企业    |    5 |
| 有来源链接资源         |    5 |
| 有来源链接日历事件     |    5 |
| `example.com` 占位链接 |    0 |

### 自动验证结果

- `npx prisma migrate dev --name product_refactor`：通过
- `npm run prisma:generate`：通过
- `npm run prisma:seed`：通过
- `npm run lint`：通过
- `npm run typecheck`：通过
- `npm run build`：通过
- `npm run test:unit`：通过，`12/12`
- `npm run test:e2e`：通过，`40/40`
- 禁止假链接扫描：页面、组件、seed 中未发现 `example.com`；仅安全函数保留拦截规则。

### 生产部署验证

- 生产 URL：<https://vehicle-campus-hub.vercel.app>
- Vercel 状态：Ready
- 部署时间：2026-06-10 15:55:59（中国标准时间）
- 部署 ID：`dpl_2EyNvpk2qmBgpzYZEPEqz9ZMHJYq`
- 应用 commit：`f97979460554dde3aac423674f376072e237f957`
- 线上检查页面：`/`、`/companies`、`/companies/xiaomi-auto`、`/companies/byd`、`/calendar`、`/resources`、`/about`
- 线上结果：HTTP 200、无白屏、无 hydration error、无严重控制台错误、无横向滚动、无 `example.com` 链接、无空 `href`
- `/admin`：生产环境返回 404

线上首次复测发现首页和公司库存在 React hydration 文本不一致，根因为公司卡片日期在 Vercel UTC 与本地浏览器时区格式化不一致。已将公司卡片日期格式化固定到 UTC，重新部署后线上错误消失。

Playwright 覆盖 `/`、`/companies`、`/companies/xiaomi-auto`、`/companies/byd`、`/calendar`、`/resources`、`/about`、`/admin` 守卫，以及 390px 移动端和多视口横向滚动检查。

### 仍需人工补充

1. 当前只有 5 家企业保留了可点击官方/招聘入口，其余企业需逐条补充真实 2027 届官方投递页。
2. 待确认企业的开始/截止时间不应作为真实校招批次使用，需要后续用官方公告或学校就业网来源核验。
3. 候选人经验资料目前是准备框架，需要补充真实来源链接后再提升可信度。
4. 后续如启用后台，需要接入真实登录或至少增加部署环境密钥/访问控制。

测试日期：2026-06-09

## 访问页面

- 生产环境：<https://vehicle-campus-hub.vercel.app/resources>
- 修复后本地环境：<http://127.0.0.1:3000/resources>
- 浏览器：Playwright + Microsoft Edge Chromium
- 视口：iPhone SE `375×667`、iPhone 14 `390×844`、iPad `820×1180`、Desktop `1440×1000`

Windows Computer Use 原生连接不可用，因此按照任务要求改用 Playwright 浏览器引擎完成真实页面访问、点击、筛选、外链跳转、控制台监听、网络监听和截图检查。

## 线上基线

- `/resources` 返回 HTTP 200，可正常加载，无白屏。
- 未发现 hydration error、React 页面异常或失败网络请求。
- 页面加载完成后没有残留“正在加载校招数据...”。
- 首次多视口采样出现过一次无 URL 详情的 404 控制台消息，后续独立复测和自动化测试均未复现。
- 公司、资料类型、可信度筛选和搜索原本可以工作。
- “小米汽车 + 面经 + 官方”组合正确进入无结果状态。
- iPhone SE、iPhone 14、iPad 和 1440px Desktop 均无横向滚动。

## 发现的问题

### P0

1. 46 个“查看资料”按钮指向 `example.com`，会把 seed 占位地址呈现成正式外链。
2. 外链校验只检查 `http/https` 协议，没有拦截占位域名、本地地址或无效值。

### P1

1. 50 张卡片标题、来源和摘要高度重复，页面有明显 demo 感。
2. 官方、较可信、经验参考和待核实几乎使用同一种视觉表现。
3. 筛选区缺少结果数量、清除入口和快捷筛选。
4. 空状态虽有文字提示，但不能直接恢复全部结果。
5. 资源页没有明确说明当前数据是示例数据。
6. 卡片缺少更新时间和来源等级解释。

### P2

1. 缺少最近更新、官方优先等排序。
2. 缺少“只看官方资料”快捷入口。
3. 缺少资源统计和有效外链数量。
4. 资源页汽车科技感弱于首页，行业识别主要依赖全站配色。

## 已修复

1. `safeExternalUrl` 现在拒绝 `example.com`、子域、localhost、回环地址、非 HTTP 协议和非法 URL。
2. 空链接、占位链接统一显示不可点击的“暂无外部链接”。
3. 资源 seed 和本地数据库已移除全部 `example.com` 资源链接。
4. 仅保留小米招聘官网和电装 Careers 两个已核验官方入口。
5. 新增示例数据警示，明确经验信息和时效需二次核验。
6. 新增收录数、官方数、有效外链数、最近更新时间统计。
7. 新增最近更新、官方优先、公司名称排序。
8. 新增“只看官方资料”和“清除筛选”。
9. 空状态新增图标、解释和一键清除筛选。
10. 官方、较可信、经验参考、待核实使用独立色彩、强调线和来源说明。
11. 卡片新增更新时间，标题限制两行，层级和扫描效率更清晰。
12. 手机端筛选改为两列，按钮触控高度提升，无横向溢出。
13. seed 标题和摘要改为多模板组合，50 条标题均唯一。

## 内容审计

| 检查项             | 修复后结果 |
| ------------------ | ---------: |
| 资源总数           |         50 |
| 官方资料           |          2 |
| 较可信             |         23 |
| 经验参考           |         25 |
| 空链接/禁用链接    |         48 |
| `example.com` 链接 |          0 |
| 唯一标题           |         50 |
| 唯一摘要模板       |          8 |

“官方”资料现在只对应企业官方域名；没有可核验入口的公开整理不再标记为官方。

## Playwright 测试

新增 `tests/e2e/resources.spec.ts`，覆盖：

1. `/resources` 可打开且“笔试面经”存在。
2. 资源卡片数量大于 0。
3. 公司、资料类型、可信度筛选改变结果。
4. 搜索“小米”只显示小米汽车资料。
5. 官方快捷筛选和最近更新排序存在。
6. 组合筛选无结果时显示清晰空状态。
7. `example.com` 和空链接不渲染为可点击按钮。
8. 已核验官方资料可打开新窗口。
9. iPhone SE、iPhone 14、iPad、Desktop 1440 无横向滚动。
10. 无 page error、严重 console error 或失败请求。

最终结果：

- `npm run test:e2e`：通过，`40/40`
- `npm run test:unit`：通过，`12/12`
- `npm run lint`：通过，0 错误
- `npm run build`：通过，14 个页面/API 路由完成构建（包含 `/icon.svg`）

## 最终生产部署验证

- 生产 URL：<https://vehicle-campus-hub.vercel.app/resources>
- Vercel 部署状态：Ready
- 部署时间：2026-06-09 22:33:51（中国标准时间）
- 应用部署 commit：`635e048f7493e793aed7d449343da5c1f262e537`
- 生产部署 ID：`dpl_Cbj9FiFagVqXAtXDGh5CLLnp118e`
- 生产 Playwright：通过，`18/18`

生产环境验证覆盖 Desktop Chrome 和移动端浏览器项目，并确认：

1. 页面无白屏、hydration error、严重控制台错误或非预期失败请求。
2. 搜索、公司/资料类型/可信度三个筛选器正常。
3. “只看官方资料”和排序正常。
4. `example.com` 与空链接不显示为可点击按钮，已核验官方资料可正常跳转。
5. 示例数据提示、统计信息和筛选空状态均存在。
6. iPhone SE、iPhone 14、iPad、Desktop 1440 均无横向滚动。

首次生产复测发现 `/favicon.ico` 返回 404，以及页面重载时 Next.js 预取请求产生浏览器主动取消。已增加 `app/icon.svg`，并让测试仅忽略明确的 `net::ERR_ABORTED` 浏览器取消请求；其他请求失败仍会导致测试失败。重新部署后生产测试全部通过。

## UI 风格反思

当前深海军蓝、橙色仪表强调和方正工业卡片具备基础汽车科技感。修复前资源页仍像通用卡片 demo：信息重复、可信度差异弱、缺少统计和更新时间。修复后通过“知识车库”语义、统计仪表、可信度色带、来源说明和官方快捷筛选，更接近可实际使用的车辆行业校招资料库。

信息层级现为：示例警示 → 数据统计 → 搜索筛选 → 可信度与更新时间 → 外链状态，扫描路径更清楚。官方信息使用绿色，较可信使用蓝色，经验参考使用琥珀色，待核实使用棕红色，官方与经验内容已明显区分。

仍不建议在没有行为数据时伪造“热门资料”。下一阶段应基于真实点击/收藏统计增加热门资料，并增加分页或分组，避免 50 张卡片形成过长列表。还可加入企业 Logo、招聘阶段、岗位方向标签和资料纠错入口，进一步减少模板感。

## 仍需人工确认

1. 目前只有 2 条已核验官方资源入口，其余 48 条保持禁用，需运营逐条补充真实来源。
2. 企业招聘 URL 可能改版或下线，建议增加定时 HEAD/GET 检查和人工复核队列。
3. “热门资料”需要接入真实点击、收藏或使用数据后再上线。
4. seed 仍是产品演示数据，不代表 2026 年 6 月 9 日的实时招聘批次。

---

## 2026-06-12 工程规范化与 PostgreSQL 迁移验收

### 原有问题

1. 仓库没有 CI、正式发布流程、部署标签和受保护的 `main` 工作流。
2. Prisma 使用被 Git 跟踪的 SQLite 运行数据库，无法支持可靠的 Vercel 生产持久化与恢复。
3. GitHub、Vercel、数据库和生产部署之间缺少可核对的 commit 记录。
4. 生产构建下，公司列表点击详情会发出成功的 RSC 请求，但 Next.js 客户端路由不提交 URL，用户停留在列表页。

### 数据库与工程变更

- Prisma datasource 已从 SQLite 改为 PostgreSQL。
- SQLite migrations 已归档，新增 PostgreSQL baseline migration。
- Neon Marketplace 资源：`vehicle-campus-hub-db`，project id `bitter-rain-33120568`。
- Vercel Production、Preview、Development 已连接 Neon；迁移连接优先使用 `DIRECT_URL` 或 `DATABASE_URL_UNPOOLED`。
- SQLite 数据已通过事务导入 Neon，并执行数量与关联校验。
- 生产数据基线：Company 25、CompanyLink 51、Recruitment 3、Resource 6。
- 22 家企业有可用招聘或企业入口；只有 3 家具备明确的 2027 届项目证据，剩余 22 家仍需人工补充官方证据。

### CI/CD 与回退能力

- GitHub Actions 门禁覆盖 Prisma generate、PostgreSQL migration、seed、数据库校验、UTF-8、format、lint、typecheck、unit、build 和完整 Playwright。
- PR 由 GitHub Actions 创建 Vercel Preview。
- `main` CI 成功后由 GitHub Actions 构建并部署 Vercel Production。
- 生产 smoke 校验 `/api/health.commit`，通过后创建 `deploy-日期-短SHA` 标签。
- Release Please 维护版本 PR、CHANGELOG、tag 和 GitHub Release。
- 新增 `CONTRIBUTING.md`、`RELEASE.md`、`ROLLBACK.md`、`SECURITY.md`、ADR、PR 和 Issue 模板。
- `main` 已要求 PR、`quality`、`pull-request-title`、`analyze`、`deploy-preview`、`CodeQL`，并禁止 force push 和分支删除。
- Secret Scanning、Push Protection 与 Dependabot security updates 已启用。

### 本轮修复

1. Playwright 改为测试 `next build && next start` 的生产构建，不再以开发服务器结果代替生产行为。
2. 公司详情完整 RSC 树在 Next 15 客户端切换时出现稳定挂起；直接访问正常、响应为 200 且无控制台错误。公司详情入口改为标准同站文档导航，真实点击连续 3 次通过。
3. 移动端 44px 热区测试先等待首页列表稳定为 3 条，避免在响应式 `useEffect` 切换期间测量即将卸载的节点。
4. Playwright 控件扫描限定在应用的 header、main、footer，避免把框架开发工具注入节点误判为产品控件。
5. CodeQL 发现资源刷新脚本使用 URL 子串统计占位域名；现已改为解析 hostname，并覆盖路径文本和伪装域名绕过测试。
6. CI 复测发现资源详情存在同类客户端动态路由挂起，现统一改为标准同站文档导航；多路由巡检只忽略浏览器主动取消的 `ERR_ABORTED` 预取请求。
7. Preview 曾与其他部署同时执行生产迁移并争抢 PostgreSQL advisory lock；Vercel 默认构建现仅执行 build，只有 Production workflow 显式加载生产环境并运行 `migrate deploy`。

### 最终本地结果

- `npm run test:e2e`：通过，50 passed、2 skipped、0 failed。
- `npm run test:unit`：通过，14 passed、0 failed。
- `npm run lint`：通过，0 errors。
- `npm run typecheck`：通过。
- `npm run build`：通过，15 个静态/动态页面与 API 路由完成生产构建。
- PostgreSQL migration、SQLite import、seed 和数据库校验：通过。

### 仍需人工确认

1. 22 家企业缺少可证明 2027 届项目开放的官方证据，不能根据通用招聘门户推断为已开放。
2. Neon 数据恢复演练应在非生产 branch 执行，避免为验证流程扰动生产数据。
