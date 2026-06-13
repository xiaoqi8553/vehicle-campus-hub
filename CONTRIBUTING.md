# 贡献规范

## 分支

- `main` 始终保持可部署，不直接开发。
- 功能分支命名为 `codex/<类型>-<主题>`，例如 `codex/fix-calendar-source`。
- 开始工作前先同步 `main`，不要使用 force push 改写共享历史。

## 提交

提交遵循 Conventional Commits：

- `feat:` 新功能
- `fix:` 缺陷修复
- `docs:` 文档
- `test:` 测试
- `refactor:` 不改变行为的重构
- `ci:` 工作流
- `chore:` 维护任务
- `revert:` 回退

标题应说明行为变化，不使用“update files”一类模糊描述。

## Pull Request

1. PR 标题使用 Conventional Commit 格式。
2. 填写用户影响、数据迁移、验证结果和回退方式。
3. CI、CodeQL 和 Vercel Preview 必须通过。
4. 默认 Squash Merge；`main` 禁止 force push 和删除。
5. 数据模型变更必须包含 Prisma migration 和兼容性说明。

## 本地检查

```bash
npm run check
npm run build
npm run test:e2e
```

涉及数据库时额外运行：

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
npm run db:verify
```

## 数据原则

- 不编造招聘项目、日期、岗位或官方链接。
- 通用招聘站不能证明具体届次已经开放。
- 失效、空值、`#` 和占位域名不得渲染为有效操作。
- 生产数据变更前建立 Neon 恢复点。
- 破坏性数据库变更必须拆成 expand/contract 两个版本。
