# 工程治理检查表

更新时间：2026-06-11

| 项目                               | 状态         | 说明                                           |
| ---------------------------------- | ------------ | ---------------------------------------------- |
| `v2.1.0` 基线 tag                  | 已完成       | 指向 `f3480ca` 并已推送                        |
| GitHub Release `v2.1.0`            | 待账户授权   | GitHub CLI 当前未登录                          |
| `codex/*` 功能分支                 | 已完成       | 本轮使用 `codex/project-governance`            |
| PR 模板与 Conventional Commits     | 已完成       | commitlint 校验 PR 标题                        |
| PostgreSQL CI                      | 已完成       | PostgreSQL 16 service、migration、seed、verify |
| lint/typecheck/unit/build/e2e 门禁 | 已完成       | `.github/workflows/ci.yml`                     |
| Release Please                     | 已完成       | 版本 PR、tag、GitHub Release 自动化            |
| CodeQL 与 Dependabot               | 已完成       | 每周扫描、每月依赖 PR                          |
| Vercel 生产 smoke                  | 已完成       | 校验实际 commit 后创建部署 tag                 |
| 每周外链巡检                       | 已完成       | 浏览器审计并保存 90 天 artifact                |
| Prisma PostgreSQL baseline         | 已完成       | SQLite migrations 独立归档                     |
| SQLite 数据迁移工具                | 已完成       | 快照、事务、数量校验                           |
| Neon 发布前恢复点工具              | 已完成       | 创建 `release-backup-*` 分支                   |
| Neon Marketplace 安装              | 待人工确认   | 需要账户所有者接受服务条款                     |
| Vercel Neon 环境变量               | 待 Neon 安装 | `DATABASE_URL` 与 `DIRECT_URL`                 |
| Vercel Git Integration             | 待账户授权   | Vercel 账户需先添加 GitHub Login Connection    |
| GitHub `main` Ruleset              | 待账户授权   | 需仓库管理员启用                               |
| Secret Scanning / Push Protection  | 待账户授权   | 需 GitHub 设置页启用                           |
| 生产数据迁移                       | 待 Neon 安装 | 迁移前先建立恢复点                             |
| 完整数据库回退演练                 | 待 Neon 安装 | 在非生产 branch 演练                           |

## 外部配置入口

- Neon 条款确认：<https://vercel.com/xiaoqi8553f-1172s-projects/~/integrations/accept-terms/neon?source=cli>
- GitHub 仓库设置：<https://github.com/xiaoqi8553/vehicle-campus-hub/settings>
- Vercel 项目：<https://vercel.com/xiaoqi8553f-1172s-projects/vehicle-campus-hub>
- Vercel 登录连接：<https://vercel.com/account/settings/authentication>
