# 工程治理检查表

更新时间：2026-06-12

| 项目                               | 状态       | 说明                                           |
| ---------------------------------- | ---------- | ---------------------------------------------- |
| `v2.1.0` 基线 tag                  | 已完成     | 指向 `f3480ca` 并已推送                        |
| GitHub Release `v2.1.0`            | 发布收尾中 | 基线 tag 已推送，Release 随本轮发布创建        |
| `codex/*` 功能分支                 | 已完成     | 本轮使用 `codex/project-governance`            |
| PR 模板与 Conventional Commits     | 已完成     | commitlint 校验 PR 标题                        |
| PostgreSQL CI                      | 已完成     | PostgreSQL 16 service、migration、seed、verify |
| lint/typecheck/unit/build/e2e 门禁 | 已完成     | `.github/workflows/ci.yml`                     |
| Release Please                     | 已完成     | 版本 PR、tag、GitHub Release 自动化            |
| CodeQL 与 Dependabot               | 已完成     | 每周扫描、每月依赖 PR                          |
| Vercel 生产 smoke                  | 已完成     | 校验实际 commit 后创建部署 tag                 |
| 每周外链巡检                       | 已完成     | 浏览器审计并保存 90 天 artifact                |
| Prisma PostgreSQL baseline         | 已完成     | SQLite migrations 独立归档                     |
| SQLite 数据迁移工具                | 已完成     | 快照、事务、数量校验                           |
| Neon 发布前恢复点工具              | 已完成     | 创建 `release-backup-*` 分支                   |
| Neon Marketplace 安装              | 已完成     | Vercel Neon 资源 `vehicle-campus-hub-db`       |
| Vercel Neon 环境变量               | 已完成     | pooled runtime 与 unpooled migration 连接      |
| Vercel Actions 部署                | 已完成     | GitHub Actions 管理 Preview 与 Production      |
| GitHub `main` Ruleset              | 已完成     | 强制 PR、状态检查、线性历史，禁止强推和删除    |
| Secret Scanning / Push Protection  | 已完成     | Secret Scanning、Push Protection 已启用        |
| 生产数据迁移                       | 已完成     | 25 家企业、51 条链接及关联数据校验一致         |
| 完整数据库回退演练                 | 延期       | 需在非生产 Neon branch 执行恢复演练            |

## 当前数据基线

- Neon project：`bitter-rain-33120568`
- Company：25
- CompanyLink：51
- Recruitment：3
- Resource：6
- 有可用入口的企业：22
- 有明确 2027 届官方证据的企业：3
- 仍需人工补充 2027 届官方证据的企业：22

## 外部配置入口

- Neon：通过 Vercel Marketplace 管理，资源名 `vehicle-campus-hub-db`
- GitHub 仓库设置：<https://github.com/xiaoqi8553/vehicle-campus-hub/settings>
- Vercel 项目：<https://vercel.com/xiaoqi8553f-1172s-projects/vehicle-campus-hub>
