# Changelog

## [2.2.0](https://github.com/xiaoqi8553/vehicle-campus-hub/compare/v2.1.0...v2.2.0) (2026-06-16)


### Features

* establish governed releases and PostgreSQL production ([dfd522d](https://github.com/xiaoqi8553/vehicle-campus-hub/commit/dfd522dc5c14079c5c82067a8a1e59d176e6a932))
* polish public product layout and logos ([12b7071](https://github.com/xiaoqi8553/vehicle-campus-hub/commit/12b70711daed0babb60ef3137dddf289ca48b5f4))
* rebuild public site as CheZhao Radar ([#14](https://github.com/xiaoqi8553/vehicle-campus-hub/issues/14)) ([e176d10](https://github.com/xiaoqi8553/vehicle-campus-hub/commit/e176d10830e26831c976217082b5298ddfbfae86))


### Bug Fixes

* restore scheduled link audit ([264cecb](https://github.com/xiaoqi8553/vehicle-campus-hub/commit/264cecbbd5d1503ab6d8a8c21cc9c40e57a12a1c))
* support prisma in vercel runtime ([#12](https://github.com/xiaoqi8553/vehicle-campus-hub/issues/12)) ([c39e2b2](https://github.com/xiaoqi8553/vehicle-campus-hub/commit/c39e2b2e038f3466a78558601bc8caa1e020a057))

## [Unreleased]

### Added

- 新增“车招雷达”公众品牌、品牌图形和面向学生的全站导航。
- 新增首页机会卡、真实变化记录、技术方向入口和校招准备路径。
- 新增公众页面 E2E 契约与 2026-06-13 桌面、移动端视觉截图。

### Changed

- 将首页从招聘情报台重建为搜索优先的机会发现页，手机端只展示 3 个明确机会。
- 将公司库改为宽松的机会比较列表，统一展示状态、技术方向、来源类型和最后核验时间。
- 将公司详情改为“当前机会、技术方向、官方来源、FAQ、下一步行动”的判断页。
- 日历删除 22 条重复观察记录，改为明确节点、无截止项目和单一观察名单入口。
- 求职资料库改为“车辆行业求职指南”，增加路线图、精选指南和完整阅读卡片。
- 关于页改为公众使命、信息规则、反馈方式、免责声明和产品路线图。
- 降低 Playwright 并发并固定 Next.js tracing root，提升 Windows worktree 下的构建稳定性。

### Fixed

- 修复多个公众页面源码中的乱码文案。
- 修复桌面公司详情链接偶发点击不跳转。
- 修复移动端导航测试、Hero 标题换行和资源来源标签表达。

### Verified

- Unit 14/14。
- Playwright 66 passed / 2 intentional skipped。
- UTF-8、Prettier、ESLint、TypeScript 和 production build 通过。

## [2.1.0] - 2026-06-11

### Added

- 新增 `CompanyLink` 链接证据模型和数据库迁移。
- 新增 51 条浏览器核验链接及六种健康状态。
- 新增 6 个资料正文页、文章目录与检查清单。
- 新增真实 GitHub Issue 数据纠错入口。
- 新增竞品研究、链接审计和重构前后截图。

### Changed

- 首页改为搜索优先，并限制桌面最多 6 家、移动端最多 3 家企业。
- 公司列表每家公司只保留一个主操作，其余链接进入更多来源。
- 公司详情按项目、来源、企业官网分层展示证据。
- 日历改为“开放但无截止日期”和“尚未发布项目”两组。
- 小米失效 `/campus/0` 深链撤销为投递入口并标记 404。

### Verified

- Unit 13/13。
- Playwright 50 passed / 2 intentional skipped。
- TypeScript、ESLint 和 production build 通过。

## [2.0.0] - 2026-06-11

### Changed

- 将全站重构为浅色、紧凑的车辆招聘情报台。
- 首页只展示 8 条企业检索结果和 5 条真实变化记录。
- 公司库改为可扫描的证据列表，分开显示招聘官网、2027 状态和核验时间。
- 公司详情将官方项目、官方岗位和业务方向参考分开展示。
- 日历仅发布有来源、核验时间和明确日期的事件；当前无可靠日期时显示空状态。
- 资源库删除 50 条企业重复模板，保留 6 份公共方法资料。

### Data

- 新增 `Company.recruitmentWebsite`。
- `Resource.companyId` 改为可空，支持公共资料。
- 25 家企业补充官方官网和招聘入口候选。
- 仅保留小米、小鹏、比亚迪 3 条有明确 2027 届实习证据的项目。
- 删除未核验的伪岗位和日历事件。
