# Vehicle Campus Hub 公开产品精修报告

日期：2026-06-16
范围：在现有线上版本基础上优化版心、字号、品牌标识、首页信息架构、公司机会筛选、公开文案和移动端体验。

## 1. 修改前问题截图

| 页面 | 截图 |
|---|---|
| 首页桌面 | `docs/iterations/2026-06-16/before/home-desktop.png` |
| 首页移动端 | `docs/iterations/2026-06-16/before/home-mobile.png` |
| 公司机会桌面 | `docs/iterations/2026-06-16/before/companies-desktop.png` |
| 公司机会移动端 | `docs/iterations/2026-06-16/before/companies-mobile.png` |

修改前主要问题：

- 桌面端主内容宽度约 1180px，在 1440px 视口下偏窄。
- 首页机会卡片仅展示 3 条，公开产品的入口感不足。
- 公司标识使用单字占位，品牌识别弱。
- 首页存在两个方向入口模块，“热门方向”和“按车辆技术方向找机会”重复。
- 部分文案偏口号化，例如“少翻群聊”“不让你错过变化”“给正在寻找车辆行业方向的你”。

## 2. 修改后截图

| 页面 | 截图 |
|---|---|
| 首页桌面 | `docs/iterations/2026-06-16/after/home-chromium.png` |
| 首页移动端 | `docs/iterations/2026-06-16/after/home-mobile.png` |
| 公司机会桌面 | `docs/iterations/2026-06-16/after/companies-chromium.png` |
| 公司机会移动端 | `docs/iterations/2026-06-16/after/companies-mobile.png` |
| 公司详情桌面 | `docs/iterations/2026-06-16/after/company-detail-chromium.png` |
| 校招日历桌面 | `docs/iterations/2026-06-16/after/calendar-chromium.png` |
| 求职指南桌面 | `docs/iterations/2026-06-16/after/resources-chromium.png` |
| 关于页面桌面 | `docs/iterations/2026-06-16/after/about-chromium.png` |

## 3. Logo 来源表

本轮为 25 家企业补充本地 Logo 资源，统一存放在 `public/company-logos/`。优先使用企业官网、招聘官网或官方 favicon；暂未取得可稳定复用图片的企业使用中性 SVG 占位，但不再显示单字占位。

完整机器可读来源见：`docs/iterations/2026-06-16/logo-sources.json`。

| 企业 | 本地文件 | 来源 | 状态 |
|---|---|---|---|
| Xiaomi Auto | `/company-logos/xiaomi-auto.ico` | `https://www.mi.com/favicon.ico` | 官方 favicon |
| Li Auto | `/company-logos/li-auto.ico` | `https://www.lixiang.com/favicon.ico` | 官方 favicon |
| NIO | `/company-logos/nio.svg` | `https://www.nio.cn/` | 中性占位 |
| XPeng | `/company-logos/xpeng.ico` | `https://www.xiaopeng.com/favicon.ico?favicon.dba88f4b.ico` | 官方 favicon |
| Leapmotor | `/company-logos/leapmotor.svg` | `https://www.leapmotor.com/` | 中性占位 |
| Zeekr | `/company-logos/zeekr.png` | `https://www.zeekrgroup.com/favicon.png` | 官方 favicon |
| Tesla | `/company-logos/tesla.ico` | `https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon.ico` | 官方 favicon |
| BYD | `/company-logos/byd.svg` | `https://www.bydglobal.com/cn/` | 中性占位 |
| Geely | `/company-logos/geely.ico` | `https://www.geely.com/favicon.ico` | 官方 favicon |
| Changan | `/company-logos/changan.ico` | `https://www.changan.com.cn/favicon.ico` | 官方 favicon |
| GAC | `/company-logos/gac.webp` | `https://br-www-resouce-cdn.gacgroup.com/static/Global/tenant/cms/common/202503/60ff2381-aa68-418e-8634-d1d47b19d8cb.webp` | 官方公开资源 |
| SAIC | `/company-logos/saic.ico` | `https://www.saicmotor.com/favicon.ico` | 官方 favicon |
| FAW | `/company-logos/faw.svg` | `https://www.faw.com.cn/` | 中性占位 |
| Dongfeng | `/company-logos/dongfeng.ico` | `https://www.dfmc.com.cn/favicon.ico` | 官方 favicon |
| GWM | `/company-logos/great-wall.ico` | `https://www.gwm.com.cn/favicon.ico` | 官方 favicon |
| CATL | `/company-logos/catl.ico` | `https://www.catl.com/favicon.ico` | 官方 favicon |
| CALB | `/company-logos/calb.ico` | `https://www.calb-tech.com/favicon.ico` | 官方 favicon |
| Bosch | `/company-logos/bosch.ico` | `https://www.bosch.com.cn/media/tech/tech_images/favicon.ico` | 官方 favicon |
| Continental | `/company-logos/continental.ico` | `https://www.continental.com/favicon.ico` | 官方 favicon |
| ZF | `/company-logos/zf.png` | `https://www.zf.com/master/media/toolbox/assets/img/zf_logo_blue_3c.png` | 官方公开资源 |
| Denso | `/company-logos/denso.svg` | `https://www.denso.com/cn/zh/` | 中性占位 |
| Horizon Robotics | `/company-logos/horizon.ico` | `https://www.horizon.auto/favicon.ico` | 官方 favicon |
| Momenta | `/company-logos/momenta.ico` | `https://www.momenta.cn/favicon.ico` | 官方 favicon |
| Hirain | `/company-logos/jingwei-hirain.ico` | `https://www.hirain.com/favicon.ico` | 官方 favicon |
| Hesai | `/company-logos/hesai.svg` | `https://www.hesaitech.com/cn/` | 中性占位 |

后续仍建议人工补齐 NIO、Leapmotor、BYD、FAW、Denso、Hesai 的授权品牌图。

## 4. 首页模块调整

- 主内容版心从约 1180px 扩展到 1300px 设计上限，桌面 1440px 下实测 `.shell` 宽度不低于 1280px。
- 首页 H1 改为“车辆行业 2027 届校招信息汇总”，桌面字号控制在 48-56px，移动端 32-36px。
- 删除底部“按车辆技术方向找机会”独立大模块。
- Hero 中保留方向快捷入口，点击进入 `/companies?direction=...`，不再占用首页底部大篇幅。
- “现在值得关注的机会”从 3 条扩展到 6 条，按“明确项目 / 入口已核验 / 观察项”分层展示。
- 移动端通过 CSS 展示 5 条可见机会卡，保留进入公司机会页的路径，减少首页长度。

## 5. 文案改写清单

| 原表达 | 新表达 |
|---|---|
| 更快找到适合你的车企机会 | 车辆行业 2027 届校招信息汇总 |
| 帮你少翻群聊，多做准备 | 车辆行业校招信息聚合平台 |
| 信息更新，不让你错过变化 | 近期可用入口与项目状态 |
| 给正在寻找车辆行业方向的你 | 面向车辆行业方向同学的信息服务 |
| 每条机会，都说明信息从哪里来 | 每条招聘入口都保留来源和核验时间 |
| 反馈信息 | 提交线索 / 反馈纠错 |

整体文案从“对用户喊话”调整为公开信息产品表达：说明收录范围、来源核验、入口状态和下一步动作。

## 6. 公司机会页调整

- 新增顶部状态统计：正在招聘、入口已核验、待确认、暂无可用入口。
- 将“车辆方向”作为页面核心筛选，增加方向快捷筛选按钮。
- 公司卡片、首页机会卡和详情页统一使用 `CompanyLogo`，所有图片含 `alt`。
- 默认排序保持“明确 2027 项目优先、最近核验、官方入口可用、公司名”。
- 对“信息待确认 / 入口待补充 / 访问受限”继续使用状态标签与来源说明，避免把通用招聘官网误标为具体项目。

## 7. 移动端检查结果

Playwright 已覆盖：

- iPhone SE：无横向滚动，主要按钮和输入控件高度达 44px 交互目标。
- iPhone 14：无横向滚动，首页可见机会卡 5 条，Logo 清晰。
- iPad：无横向滚动，公司筛选和卡片布局未溢出。
- Desktop 1440：主内容宽度达到本轮目标，机会卡更舒展。

## 8. 测试结果

已执行：

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm run test:unit`：14 passed。
- `npm run build`：通过，Next.js 15.5.19 生产构建成功。
- `npm run test:e2e`：76 passed，2 skipped。

新增或更新覆盖：

- 桌面端版心宽度不低于 1280px。
- 首页机会卡数量为 6 条。
- 首页不再出现“按车辆技术方向找机会”独立大模块。
- 公司卡片不再使用单字占位标识。
- 每张公司卡具备 Logo 图片或可访问中性 fallback。
- 公司机会页方向快捷筛选可用。
- 全站不出现“少翻群聊”“不让你错过变化”“反馈信息”等旧文案。
- 移动端无横向滚动，主要操作控件满足点击目标。

## 9. 仍需人工补充

- 对中性占位 Logo 企业补充可授权品牌图。
- 持续核验 2027 届具体项目，不把通用招聘官网作为“已开放项目”证据。
- 后续可增加用户提交线索后的审核队列，减少手工维护成本。
