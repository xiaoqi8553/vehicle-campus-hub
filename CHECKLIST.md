# Vehicle Campus Hub 验收清单

## 工程

- [x] package scripts 完整
- [x] 依赖安装成功
- [x] Prisma generate 成功
- [x] 数据库迁移成功
- [x] seed 成功
- [x] 公司、校招、岗位、资料、日历事件均有数据

## 页面

- [x] 首页可访问并显示标题、统计和公司卡片
- [x] 公司库支持搜索、筛选、排序
- [x] 公司详情展示基础信息、校招、岗位、资料、日历和建议
- [x] 校招日历显示近期事件
- [x] 笔试面经显示资料卡片
- [x] 后台显示四类管理区域且表单可提交
- [x] 外部链接为空时安全降级
- [x] API 或数据库失败时有错误/空状态
- [x] 移动端无严重布局问题

## 数据一致性

- [x] Company 数组字段读写类型一致
- [x] Recruitment.companyId 关联正确
- [x] Job.companyId 关联正确
- [x] Resource.companyId 关联正确
- [x] CalendarEvent.companyId 关联正确
- [x] 公司详情关联数据可查询

## 自动检查

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test:unit`
- [x] `npm run test:e2e`
- [x] 完整 Chromium 桌面端视觉检查
- [x] 完整 Chromium 移动端视觉检查

## 文档

- [x] README.md 完整
- [x] TEST_REPORT.md 已记录最终结果
