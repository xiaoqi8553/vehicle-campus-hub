# Security Policy

## Supported versions

仅当前生产版本和最新 `main` 接收安全修复。

## Reporting

不要在公开 Issue 中提交连接串、令牌、个人信息或未修复漏洞细节。使用 GitHub Security Advisory 私下报告；普通数据纠错继续使用现有 Issue 模板。

## Repository rules

- `.env`、数据库文件、密钥和平台令牌不得提交。
- 所有外部输入经过 Zod 或等价校验。
- `/admin` 在未配置真实鉴权前保持生产 404。
- 依赖安全由 Dependabot、`npm audit` 和 CodeQL 持续检查。
