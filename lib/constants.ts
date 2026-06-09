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
  "车身",
  "动力总成",
  "三电",
  "电池",
  "电机电控",
  "热管理",
  "自动驾驶",
  "智能座舱",
  "嵌入式",
  "车载软件",
  "测试验证",
  "CAE仿真",
  "制造工艺",
] as const;

export const RESOURCE_TYPES = ["笔试", "面经", "测评", "简历", "投递攻略"] as const;
export const CREDIBILITY_LEVELS = ["官方", "较可信", "经验参考", "待核实"] as const;

export type RecruitmentStatus = (typeof RECRUITMENT_STATUSES)[number];
