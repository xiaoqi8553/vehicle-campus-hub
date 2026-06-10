export const COMPANY_CATEGORIES = [
  "新势力",
  "传统车企",
  "外资车企",
  "零部件",
  "自动驾驶",
  "电池三电",
  "智能化供应商",
] as const;

export const RECRUITMENT_STATUSES = [
  "未开始",
  "已开启",
  "即将截止",
  "已结束",
  "待确认",
] as const;

export const JOB_DIRECTIONS = [
  "整车研发",
  "底盘",
  "三电",
  "电池",
  "热管理",
  "自动驾驶",
  "嵌入式",
  "智能座舱",
  "测试验证",
  "车身",
  "动力总成",
  "电机电控",
  "车载软件",
  "CAE仿真",
  "制造工艺",
] as const;

export const RESOURCE_TYPES = ["笔试", "面经", "测评", "简历", "投递攻略"] as const;
export const CREDIBILITY_LEVELS = ["官方", "较可信", "经验参考", "待核实"] as const;
export const DATA_STATUSES = ["已核验", "待核实", "缺链接", "过期"] as const;
export const SOURCE_TYPES = ["官方招聘站", "官方公众号", "学校就业网", "公开整理", "候选人经验"] as const;
export const CALENDAR_EVENT_TYPES = ["网申开始", "网申截止", "笔试", "面试", "宣讲会"] as const;
export const RESOURCE_TAGS = [
  "自动驾驶",
  "嵌入式",
  "C++",
  "车辆动力学",
  "底盘",
  "三电",
  "电池",
  "热管理",
  "测试验证",
  "群面",
  "HR面",
] as const;

export type RecruitmentStatus = (typeof RECRUITMENT_STATUSES)[number];
