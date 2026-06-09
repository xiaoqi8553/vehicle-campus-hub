# Vehicle Campus Hub 最终测试报告

测试日期：2026-06-09

## 最终结果

| 检查项 | 结果 |
| --- | --- |
| `npm install` | 通过 |
| `npm run prisma:generate` | 通过 |
| `npm run prisma:migrate` | 通过，无待处理迁移 |
| `npm run prisma:seed` | 通过 |
| `npm run lint` | 通过，0 错误 0 警告 |
| `npm run build` | 通过，13 个页面/API 路由完成构建 |
| `npm run test:unit` | 通过，11/11 |
| `npm run test:e2e` | 通过，22/22 |
| `npm audit --omit=dev` | 通过，0 vulnerabilities |

## 数据验证

- Company：25
- Recruitment：25
- Job：50
- Resource：50
- CalendarEvent：25
- `xiaomi-auto` 可查询到关联校招、岗位、资料和日历事件
- `cities`、`tags`、`fitDirections` 均通过统一 JSON 序列化函数读写

## Playwright 覆盖

- 首页标题、统计与公司卡片
- 搜索“小米”只展示相关公司
- “已开启”状态筛选改变列表
- 公司卡片进入真实详情页
- 详情页五个核心信息模块
- 公司库、校招日历、笔试面经、后台管理
- 空外部链接禁用状态与无页面异常
- API 非法参数返回结构化 400 错误
- 后台表单真实新增、PUT 更新、GET 验证和 DELETE 清理
- Desktop Chrome 与 Pixel 7 六个页面全页截图
- 六个页面桌面与移动端均无横向溢出

## 视觉检查

`playwright-interactive` 未安装，Windows Computer Use 通道返回 `native pipe unavailable`。已使用 Playwright 安装的完整 Chromium 替代，生成并检查 12 张桌面/移动全页截图。

检查结论：

- 导航、badge、tag、按钮对比清楚
- 首页具有车辆仪表盘与雷达视觉特征
- 三列公司卡片信息密度合理，移动端改为单列
- 公司详情主次层级明确，求职建议独立展示
- 后台手机端表单可读，宽表格和管理标签支持横向滚动

## 已修复问题

1. 中文目录导致 npm 自动包名非法：显式设置为 `vehicle-campus-hub`。
2. TypeScript 6 与 Next.js 15 CSS 类型集成不兼容：固定为 TypeScript 5.9.3。
3. Vitest 在 Windows 中文路径下无法解析别名：改用 `fileURLToPath`。
4. 初次迁移未创建表：串行重新执行迁移和 seed。
5. E2E 后台文本定位器歧义：收紧为按钮角色定位。
6. Playwright Headless Shell CDN 连接重置：改用已下载的完整 Chromium channel。
7. Next 内置旧 PostCSS 触发审计项：统一 override 到 8.5.15，审计归零。
8. Prisma generate 被开发服务器锁定 DLL：停止本地服务后重新生成通过。
9. 后台原本只有新增能力：补充公司编辑/删除及校招、岗位、资料核心字段编辑。

## 仍需人工确认

- seed 中招聘链接和时间是演示数据，上线前需逐条替换并核实。
- `/admin` 按 MVP 要求未启用登录；公网部署前必须接入鉴权、权限和操作审计。
- 切换 PostgreSQL、部署平台、域名、监控和备份策略需在生产环境确认。
