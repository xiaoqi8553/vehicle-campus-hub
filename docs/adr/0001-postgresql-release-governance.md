# ADR 0001：PostgreSQL 与可回退发布治理

- 状态：Accepted
- 日期：2026-06-11

## 背景

项目此前从 Git 跟踪的 SQLite 文件读取生产数据，只有 `main` 分支和手工 Vercel 部署。代码可以检出旧 commit，但生产数据、迁移和部署之间没有一致的恢复点。

## 决策

1. 生产数据库迁移到 Neon PostgreSQL。
2. PR 使用临时 PostgreSQL CI 和 Neon Preview Branch。
3. `main` 是唯一生产分支，合并后由 Vercel 自动部署。
4. Release Please 管理语义版本、CHANGELOG、tag 和 GitHub Release。
5. 每次生产部署通过 `/api/health` 校验 commit，并创建不可变部署 tag。
6. 数据库 migration 使用 expand/contract，发布前创建 Neon 恢复分支。
7. SQLite migrations 只读归档，不与 PostgreSQL migrations 混用。

## 结果

- 需要维护 Neon 与 GitHub Actions 配置。
- 生产发布多了一次数据库恢复点和 smoke 检查。
- 代码、部署和数据都有可识别的回退目标。
- 破坏性 schema 修改不能再与应用删除旧字段同时发布。
