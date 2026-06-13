# Vehicle Campus Hub 产品级重构报告

## 2026-06-13 公众官网重塑

### 目标与方向

本轮采用方向 A“清爽科技求职平台”，将工程台账式界面重塑为公众品牌 **车招雷达**。核心原则是“机会优先，证据托底”：学生先看懂哪里能投、适合什么、下一步做什么，再查看来源类型、链接状态和最后核验时间。

完整设计规格：

- `docs/superpowers/specs/2026-06-13-public-website-redesign-design.md`
- `docs/superpowers/plans/2026-06-13-public-website-redesign.md`

### 信息架构变化

| 页面              | 新职责                                 |
| ----------------- | -------------------------------------- |
| `/`               | 搜索、明确机会、最近变化和技术方向发现 |
| `/companies`      | 企业筛选、排序和机会比较               |
| `/companies/[id]` | 当前机会、技术方向、来源和下一步判断   |
| `/calendar`       | 可靠日期节点、无截止项目和观察名单     |
| `/resources`      | 路线图、主题指南和完整文章             |
| `/about`          | 公众使命、信息规则、反馈和免责声明     |

公开页面已删除 `VCH`、`SEARCH FIRST`、`EVIDENCE DOSSIER`、`DECISION SUMMARY`、`公司情报库` 和 `证据档案` 等内部表达。

### 视觉系统

- 品牌：车招雷达 / Vehicle Campus Hub。
- 主色：电动蓝 `#215EE8`，配合深蓝、浅蓝背景、绿色开放状态和橙色待确认状态。
- 字体：系统现代中文字体栈，正文 16px，公众页面标题 34–60px。
- 组件：圆角卡片、轻量阴影、44px 交互热区、清楚焦点状态和 reduced-motion 支持。
- 移动端：首页只展示 3 个明确机会；公司、详情、日历、指南和关于页全部单列重排。

### 关键修复

1. 修复多个页面源码中的乱码文案。
2. 首页不再渲染公司库缩略版，改为 3 个明确机会和 5 条真实变化。
3. 公司库每家企业只有一个外部主操作和一个内部详情入口。
4. 公司详情删除内部审计语言和无法解释的精确分数。
5. 日历不再渲染 22 条重复观察记录，也不显示未核验精确日期。
6. 求职指南将“平台整理”明确标注为内容来源，并保留 6 篇完整正文。
7. 关于页只保留一个反馈主操作，并明确提交所需信息。
8. 公司详情入口改用稳定的原生同站导航，修复 Chromium 偶发不跳转。

### 本轮截图

![首页桌面](docs/redesign/2026-06-13/home-desktop.png)

![首页移动端](docs/redesign/2026-06-13/home-mobile.png)

![公司库桌面](docs/redesign/2026-06-13/companies-desktop.png)

![公司详情移动端](docs/redesign/2026-06-13/company-detail-mobile.png)

![招聘日历桌面](docs/redesign/2026-06-13/calendar-desktop.png)

![求职指南移动端](docs/redesign/2026-06-13/resources-mobile.png)

![关于页桌面](docs/redesign/2026-06-13/about-desktop.png)

### 数据边界

- 企业仍为现有 25 家，没有为丰富页面新增虚构公司。
- 明确 2027 届官方项目仍为 3 家。
- 22 家企业仍需补充明确的 2027 届项目证据。
- 5 家企业仍需人工复核或补充可用主入口。
- 未新增虚构招聘时间、岗位或官方链接。

### 自动验证

- Unit：14/14。
- Playwright：66 passed / 2 intentional skipped。
- Desktop 1440、iPad、iPhone 14、iPhone SE：无横向滚动。
- 无 `example.com`、空 `href`、严重 console error、hydration error 或关键请求失败。
- ESLint、TypeScript、UTF-8、Prettier 和 production build 通过。

---

日期：2026-06-11
目标：提升链接可理解性、信息架构与真实使用效率。

## 1. 竞品研究

完整逐站分析见 [BENCHMARK.md](BENCHMARK.md)，截图位于 `docs/benchmarks/2026-06-11/`。

本次实际采用：

1. Simplify Jobs：搜索优先、结果数量、清除筛选。
2. Levels.fyi：高密度元数据、唯一主操作。
3. Notion Careers：克制排版、内容分组、长列表留白。
4. Porsche / Bosch Careers：汽车行业气质、用户阶段和单一核心行动。
5. 实习僧：中文届次、城市和岗位方向语义。

Tesla 与 Mercedes-Benz 在自动化环境中返回 403。这一结果被用于设计“被反爬拦截”状态，没有被误判为链接失效。

## 2. 重构前后截图

### 首页

重构前：

![重构前首页](docs/redesign/2026-06-11/before-home-desktop.png)

重构后：

![重构后首页](docs/redesign/2026-06-11/after-home-chromium.png)

移动端重构后：

![重构后移动端首页](docs/redesign/2026-06-11/after-home-mobile.png)

### 公司详情与资源

![重构后公司详情](docs/redesign/2026-06-11/after-company-detail-chromium.png)

![重构前资源页](docs/redesign/2026-06-11/before-resources-desktop.png)

![重构后资源页](docs/redesign/2026-06-11/after-resources-chromium.png)

其余公司库、日历、关于页与移动端截图位于 `docs/redesign/2026-06-11/`。

## 3. 链接证据模型

新增 `CompanyLink`：

- `title`
- `url`
- `finalUrl`
- `sourceType`
- `targetCohort`
- `verifiedAt`
- `healthStatus`
- `evidenceSummary`
- `isPrimary`
- `httpStatus`

链接类型：

- `COHORT_PROJECT`
- `CAMPUS_PORTAL`
- `CAREERS_SITE`
- `OFFICIAL_ANNOUNCEMENT`
- `TALENT_PAGE`
- `COMPANY_WEBSITE`
- `TRUSTED_THIRD_PARTY`

健康状态：

- `OK`
- `BROWSER_ONLY`
- `BLOCKED`
- `REDIRECTED`
- `DEAD`
- `MANUAL_REVIEW`

`Recruitment.sourceLinkId` 现在关联到实际证据链接。通用招聘官网不会因为域名有效就被计入 2027 届开放项目。

## 4. 链接核验结果

使用真实 Chromium 页面访问核验 51 条链接，没有只依赖 HEAD 请求。

| 状态           | 数量 |
| -------------- | ---: |
| 可正常访问     |   27 |
| 已重定向       |   11 |
| 被反爬拦截     |    7 |
| 待人工确认     |    4 |
| 仅浏览器可访问 |    1 |
| 已失效         |    1 |

招聘入口与项目深链：

| 企业     | 链接类型     | 健康状态   | HTTP | URL                                                                   |
| -------- | ------------ | ---------- | ---: | --------------------------------------------------------------------- |
| Momenta  | 招聘入口     | 已重定向   |  200 | <https://momenta.jobs.feishu.cn/campus/m/>                            |
| 比亚迪   | 招聘入口     | 已重定向   |  200 | <https://job.byd.com/portal/mobile/school-home>                       |
| 博世     | 招聘入口     | 可正常访问 |  200 | <https://www.bosch.com.cn/careers/>                                   |
| 采埃孚   | 招聘入口     | 可正常访问 |  200 | <https://jobs.zf.com/?locale=zh_CN>                                   |
| 大陆集团 | 招聘入口     | 可正常访问 |  200 | <https://www.continental.com/en/career/>                              |
| 地平线   | 招聘入口     | 可正常访问 |  200 | <https://horizon-campus.hotjob.cn/>                                   |
| 电装     | 招聘入口     | 被反爬拦截 |  403 | <https://www.denso.com/cn/zh/careers/>                                |
| 东风汽车 | 招聘入口     | 可正常访问 |  200 | <https://dfmc.hotjob.cn/>                                             |
| 广汽集团 | 招聘入口     | 可正常访问 |  200 | <https://www.gacgroup.com/cn/talent>                                  |
| 禾赛科技 | 招聘入口     | 可正常访问 |  200 | <https://www.hesaitech.com/cn/careers>                                |
| 吉利汽车 | 招聘入口     | 已重定向   |  200 | <https://campus.geely.com/>                                           |
| 极氪     | 招聘入口     | 可正常访问 |  200 | <https://www.zeekrgroup.com/join-us>                                  |
| 经纬恒润 | 招聘入口     | 被反爬拦截 |  403 | <https://www.hirain.com/news/%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-16> |
| 理想汽车 | 招聘入口     | 已重定向   |  200 | <https://www.lixiang.com/employ/campus.html>                          |
| 零跑汽车 | 招聘入口     | 可正常访问 |  200 | <https://leapmotor1.zhiye.com/campus>                                 |
| 宁德时代 | 招聘入口     | 待人工确认 |    - | <https://career.catl.com/>                                            |
| 上汽集团 | 招聘入口     | 已重定向   |  200 | <https://saic-recruit.saicmotor.com/>                                 |
| 特斯拉   | 招聘入口     | 被反爬拦截 |  403 | <https://www.tesla.cn/careers>                                        |
| 蔚来     | 招聘入口     | 已重定向   |  200 | <https://campus.nio.com/>                                             |
| 小米汽车 | 历史项目深链 | 已失效     |  404 | <https://hr.xiaomi.com/campus/0>                                      |
| 小米汽车 | 校园招聘门户 | 可正常访问 |  200 | <https://hr.xiaomi.com/campus>                                        |
| 小鹏汽车 | 招聘入口     | 可正常访问 |  200 | <https://xiaopeng.jobs.feishu.cn/campus/>                             |
| 长安汽车 | 招聘入口     | 可正常访问 |  200 | <https://changan.zhiye.com/Campus>                                    |
| 长城汽车 | 招聘入口     | 已重定向   |  200 | <https://zhaopin.gwm.cn/>                                             |
| 中创新航 | 招聘入口     | 可正常访问 |  200 | <https://calbjs.zhiye.com/campus>                                     |
| 中国一汽 | 招聘入口     | 待人工确认 |    - | <https://faw-zhaopin.hotjob.cn/>                                      |

完整浏览器响应、最终 URL、页面标题与正文摘要见 `docs/audit/link-health-2026-06-11/link-audit.json`。

### 小米修复

- `/campus/0` 真实浏览器访问返回 404。
- 该链接保留为不可点击的历史失效证据。
- 2027 届判断改为引用可访问的官方校园门户 `/campus`。
- 证据摘要明确记录官方页面中的 2027 届应届实习说明。
- 失效深链不会计入可用链接或开放项目统计。

## 5. 页面结构变化

### 首页

- Hero 改为 `2027届 / 车辆行业校招情报`。
- 桌面 H1 为 40–48px，Hero 不超过 380px。
- 搜索成为首要操作。
- 首页最多显示 6 家企业，移动端最多 3 家。
- 只显示一组真实统计。
- 独立展示明确开放项目、最近核验变化和证据规则。

### 公司库

- 默认排序：明确开放项目 → 最近核验时间 → 公司名。
- 默认筛选只显示届次、公司类型、车辆方向和排序。
- 城市、项目状态、链接状态进入高级筛选。
- 每家公司最多一个外部主按钮。
- 列表直接显示来源类型、官方域名、届次、健康状态与核验时间。

### 公司详情

- 具体项目、其他来源和企业官网分层。
- 同一 URL 不重复显示“项目入口”和“核对来源”。
- 失效与反爬链接显示证据摘要但不可点击。
- 取消无法解释的数字匹配分数，改为方向依据说明。
- 新增 FAQ 和真实 GitHub 纠错入口。

### 日历

- 没有核验日期时不生成伪时间线。
- 分为“已开放但未公布截止日期”和“尚未发布 2027 项目”。
- 后者使用紧凑表格，不为 22 家企业重复渲染外部按钮。

### 资源

- 六条平台资料均标记“平台整理”。
- 每条包含独立正文页、文章目录、三个章节和检查清单。
- 不再显示“暂无外部来源”假操作。

## 6. 可访问性与移动端

- 所有搜索与筛选控件具有可访问名称。
- 外链 `aria-label` 包含公司与实际目标。
- 主要按钮、输入框、选择器和导航热区不小于 44px。
- `focus-visible` 保持清晰。
- Desktop 1440、iPad 820、iPhone 14 390、iPhone SE 375 均无横向滚动。
- 页面未出现 hydration error、page error、严重 console error或关键静态资源失败。

## 7. 最终测试

| 命令                  | 结果                                          |
| --------------------- | --------------------------------------------- |
| `npm run test:unit`   | 通过，13/13                                   |
| `npm run typecheck`   | 通过                                          |
| `npm run lint`        | 通过                                          |
| `npm run build`       | 通过，15 个页面完成构建                       |
| `npm run test:e2e`    | 通过，50 passed / 2 skipped                   |
| `npm run prisma:seed` | 通过，25 企业 / 51 链接 / 3 项目 / 6 完整资源 |

两个 skipped 用例是同一套四视口矩阵和 44px 检查在 `mobile` Playwright 项目中主动跳过，已在 `chromium` 项目内完整执行。

## 8. 仍需人工确认

自动化明确标记为 `MANUAL_REVIEW` 的链接共 4 条：

1. 中国一汽企业官网：证书日期异常。
2. 中国一汽招聘入口：浏览器超时，普通 GET 返回 200。
3. 宁德时代招聘入口：连接被远端关闭。
4. 地平线企业官网：浏览器访问超时。

被反爬拦截的 7 条链接不等于失效，但不作为正常主按钮。其中电装、特斯拉、经纬恒润等入口建议使用普通家庭网络人工复核。

## 9. 验收结论

用户现在无需点击外链即可判断：

1. 链接是具体项目、校园门户、通用招聘站、公告还是企业官网。
2. 是否明确面向 2027 届。
3. 当前是可访问、重定向、反爬、失效还是待人工确认。
4. 最近核验日期。
5. 页面唯一推荐的下一步操作。
