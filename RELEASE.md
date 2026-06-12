# 发布规范

## 日常发布

1. 从最新 `main` 创建功能分支。
2. 推送分支并创建 PR。
3. 等待 CI、CodeQL 和 `Vercel Preview` GitHub Actions。
4. 数据库变更在 PR 描述中注明兼容窗口和恢复点要求。
5. Squash Merge 到 `main`。
6. `Production Smoke` GitHub Actions 使用 Vercel CLI 部署生产。
7. `Production Smoke` 等待 `/api/health.commit` 等于合并 commit。
8. smoke test 通过后创建 `deploy-YYYYMMDD-HHmm-SHA` 标签。

生产 smoke 覆盖首页、公司库、公司详情、日历、资源、关于页和 `/admin` 404 守卫。

## 正式版本

Release Please 根据 Conventional Commits 创建 Release PR：

- `fix` → PATCH
- `feat` → MINOR
- `!` 或 `BREAKING CHANGE` → MAJOR

合并 Release PR 后自动更新 `package.json`、`CHANGELOG.md`，创建 `vX.Y.Z` 标签和 GitHub Release。

当前基线版本为 `v2.1.0`。

## 数据库发布

- 生产只执行 `prisma migrate deploy`。
- Vercel Preview 必须使用 Neon Preview Branch。
- 生产使用 Neon production branch 的 pooled `DATABASE_URL`。
- migration 使用 direct `DIRECT_URL`。
- migration 前执行 `npm run db:backup` 创建发布前恢复分支。
- migration 后执行 `npm run db:verify`。

### Expand/Contract

1. Expand：先新增可空字段、表或兼容索引，旧代码仍可运行。
2. Deploy：发布同时兼容新旧结构的应用。
3. Backfill：独立任务补数据并验证。
4. Contract：至少跨一个稳定版本后再删除旧字段。

禁止在同一生产发布中直接重命名或删除仍被上一版本使用的字段。

## GitHub 设置

仓库管理员需为 `main` 启用 Ruleset：

- Require a pull request before merging
- Require status checks：`quality`、`pull-request-title`、`analyze`
- Require branches to be up to date
- Block force pushes
- Restrict deletions
- 默认 Squash Merge

同时启用 Secret Scanning、Push Protection 和 Dependabot alerts。

## Vercel 设置

- GitHub Actions Secrets：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`
- Vercel CLI：工作流固定使用 `54.12.2`
- Preview：PR 触发 `.github/workflows/preview-deploy.yml`
- Production：`main` CI 通过后触发 `.github/workflows/production-smoke.yml`
- Node.js：24.x
- Build Command：`npm run prisma:migrate:deploy && npm run build`
- 当前 Neon 免费资源由 Vercel Marketplace 管理；迁移使用非池化连接
