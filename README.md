# 车招雷达

Vehicle Campus Hub 的公众品牌是 **车招雷达**：面向车辆工程、机械工程、自动化、控制、嵌入式、自动驾驶、三电、电池、热管理与智能座舱方向学生的 **2027 届车辆行业校招信息平台**。

[在线访问](https://vehicle-campus-hub.vercel.app) · [工程治理](./PROJECT_GOVERNANCE.md) · [发布规范](./RELEASE.md) · [回退手册](./ROLLBACK.md) · [测试报告](./TEST_REPORT.md)

![车招雷达首页](./docs/redesign/2026-06-13/home-desktop.png)

## 核心能力

- 搜索公司、城市和车辆技术方向。
- 区分具体校招项目、招聘门户、企业官网和第三方来源。
- 显示来源类型、届次、核验时间、链接健康状态和证据摘要。
- 未核验日期、失效入口和通用招聘门户不会被包装成 2027 届开放项目。
- 提供车辆方向求职资料、校招日历和数据纠错入口。
- 支持 Desktop、iPad、iPhone 14 和 iPhone SE。
- 公开页面统一使用面向学生的产品语言，不暴露后台或内部审计术语。

## 技术栈

- Next.js 15、React 19、TypeScript
- Prisma 6、PostgreSQL（Neon）
- Vitest、Playwright
- GitHub Actions、Release Please、Vercel

## 本地开发

需要 Node.js `24.16.0`、npm `11.x` 和 PostgreSQL 16+。

```bash
npm ci
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
npm run db:verify
npm run dev
```

访问 `http://localhost:3000`。不要把生产 Neon 连接串写入仓库或提交 `.env`。

## 验证命令

```bash
npm run check
npm run build
npm run test:e2e
```

完整 CI 还会在临时 PostgreSQL 16 服务中执行 migration、seed 和数据库一致性校验。

## 发布流程

1. 从最新 `main` 创建 `codex/<类型>-<主题>` 分支。
2. 提交 Conventional Commits，推送并创建 PR。
3. CI 和 Vercel Preview 通过后 Squash Merge。
4. `main` 自动部署生产，生产 smoke test 校验实际 commit。
5. 自动创建 `deploy-日期-短SHA` 部署标签。
6. Release Please 维护版本 PR、CHANGELOG、`vX.Y.Z` 标签和 GitHub Release。

详细流程见 [RELEASE.md](./RELEASE.md)。

## 数据迁移

旧 SQLite migrations 已归档在 `prisma/migrations-sqlite-archive/`，仅供审计，不再执行。
PostgreSQL baseline 位于 `prisma/migrations/`。

一次性迁移旧数据：

```bash
set SQLITE_SOURCE=prisma/dev.db
set DATABASE_URL=postgresql://...
set DIRECT_URL=postgresql://...
npm run prisma:migrate:deploy
npm run db:migrate:sqlite
npm run db:verify
```

迁移工具会先生成未跟踪的 JSON 快照与 SHA-256，再检查目标库必须为空，并在事务中保留原 ID 和关联。

## 项目结构

```text
app/                         Next.js 页面与 API
components/                  页面组件
components/brand/            公众品牌组件
components/home/             首页机会与更新组件
lib/                         数据序列化、规则与 Prisma 客户端
prisma/                      PostgreSQL schema、迁移与 seed
prisma/migrations-sqlite-archive/
                             只读 SQLite 迁移档案
scripts/                     数据迁移、校验、备份与生产检查
tests/                       Vitest 与 Playwright
.github/workflows/           CI、发布、安全和定期巡检
docs/adr/                    架构决策记录
docs/redesign/               每轮视觉迭代截图
```

## 健康检查

`GET /api/health` 返回版本、Git commit、Vercel 环境和部署 URL，不暴露数据库凭据。

版本变化见 [CHANGELOG.md](./CHANGELOG.md)。
