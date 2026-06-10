# Vehicle Campus Hub 验收清单

## 工程

- [x] package scripts 完整
- [x] 依赖安装成功
- [x] Prisma generate 成功
- [x] 数据库迁移成功
- [x] seed 成功
- [x] 公司、校招、岗位、资料、日历事件均有数据

## 页面

- [x] 首页可访问并显示“2027届车辆行业校招雷达”、统计、今日重点、公司卡片和快速筛选
- [x] 公司库支持公司名、城市、岗位方向搜索，以及类型、状态、方向、城市、可信度、官方链接筛选
- [x] 公司详情展示基础信息、2027届校招项目、可信度说明、岗位方向分组、资料和建议
- [x] 校招日历显示 7 天截止、30 天截止、本月开启、待确认关注分组
- [x] 笔试面经显示适用届别、来源年份、来源类型、资源标签和链接状态
- [x] /about 页面可访问并说明定位、人群、来源、可信度、纠错、免责声明和后续计划
- [x] 后台默认不在导航展示，`/admin` 未启用时返回 404
- [x] 后台本地启用后按 Company、RecruitmentProgram、Job、Resource、CalendarEvent 分模块维护
- [x] 外部链接为空时安全降级
- [x] API 或数据库失败时有错误/空状态
- [x] 移动端无严重布局问题

## 数据一致性

- [x] Company 数组字段读写类型一致
- [x] Company 新增 slug、shortName、type、vehicleDirections、officialWebsite、campusRecruitmentWebsite、lastVerifiedAt、dataStatus
- [x] Recruitment 新增 targetYear、batch、sourceUrl、applyUrl、sourceType、credibility、notes
- [x] Job 新增 programId、majors、skills、matchScore
- [x] Resource 新增 targetYear、sourceYear、sourceUrl、sourceType、tags、lastVerifiedAt
- [x] CalendarEvent 新增 programId、sourceUrl、credibility
- [x] Recruitment.companyId 关联正确
- [x] Job.companyId 关联正确
- [x] Resource.companyId 关联正确
- [x] CalendarEvent.companyId 关联正确
- [x] 公司详情关联数据可查询

## 自动检查

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run test:unit`
- [x] `npm run test:e2e`
- [x] 完整 Chromium 桌面端视觉检查
- [x] 完整 Chromium 移动端视觉检查

## 文档

- [x] README.md 完整
- [x] TEST_REPORT.md 已记录最终结果
