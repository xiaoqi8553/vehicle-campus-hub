# 生产回退手册

## 判断顺序

1. 查看 `https://vehicle-campus-hub.vercel.app/api/health`，记录 commit、版本和部署 URL。
2. 确认故障是否涉及数据写入或数据库结构。
3. 暂停后台写操作；当前生产默认关闭 `/admin`。
4. 根据下列场景选择最小影响的回退方式。

## 场景 A：仅应用故障

1. 在 Vercel Deployments 找到上一个 `Ready` 部署。
2. 使用 Promote/Rollback 恢复别名。
3. 运行：

```bash
SMOKE_BASE_URL=https://vehicle-campus-hub.vercel.app npm run test:smoke
```

4. 创建 `revert:` PR 修复 `main`，不要让生产长期偏离 Git。

## 场景 B：代码提交需要撤销

```bash
git switch -c codex/revert-<topic> origin/main
git revert <bad-commit>
git push -u origin codex/revert-<topic>
```

通过正常 PR、CI 和生产 smoke 发布。禁止使用 `git reset --hard` 或 force push 修改 `main`。

## 场景 C：回到正式版本

```bash
git switch -c codex/rollback-v2-1-0 v2.1.0
git push -u origin codex/rollback-v2-1-0
```

基于目标 tag 创建回退 PR，并确认目标版本与当前数据库结构兼容。

## 场景 D：数据库损坏或破坏性迁移

1. 暂停所有写入。
2. 在 Neon Console 保留当前故障分支用于取证。
3. 找到发布前 `release-backup-*` 恢复分支。
4. 将 Vercel Production 的 `DATABASE_URL`、`DIRECT_URL` 切换到恢复分支。
5. 重新部署与该数据结构兼容的应用版本。
6. 运行 `npm run db:verify` 和生产 smoke。
7. 记录丢失时间窗口、受影响记录和后续补偿。

不要在未确认数据影响时直接删除 Neon branch。

## 回退后检查

- `/api/health` commit 与目标部署一致
- `/`、`/companies`、公司详情、`/calendar`、`/resources`、`/about` 正常
- `/admin` 返回 404
- 数据数量和关联通过 `npm run db:verify`
- 无 hydration、page error、严重 console error 和失败核心请求
- 在 `TEST_REPORT.md` 或事故记录中写明原因、恢复时间和永久修复

每季度至少在非生产 Neon branch 演练一次完整回退。
