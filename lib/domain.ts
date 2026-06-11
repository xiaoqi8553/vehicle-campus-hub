import type { RecruitmentStatus } from "@/lib/constants";

const DAY_MS = 24 * 60 * 60 * 1000;

export function determineRecruitmentStatus(
  startDate: string | Date | null,
  endDate: string | Date | null,
  sourceText: string,
  now = new Date(),
): RecruitmentStatus {
  const text = sourceText.trim();

  if (/(已截止|招聘结束)/.test(text)) return "已结束";
  if (/(敬请期待|即将开启)/.test(text)) return "未开始";

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && !Number.isNaN(start.getTime()) && now < start) return "未开始";
  if (end && !Number.isNaN(end.getTime()) && now > end) return "已结束";
  if (end && !Number.isNaN(end.getTime())) {
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / DAY_MS);
    if (daysLeft >= 0 && daysLeft <= 7) return "即将截止";
  }
  if (/(正式启动|立即投递|网申开启|校园招聘启动)/.test(text)) return "已开启";
  if (start && (!end || now <= end)) return "已开启";
  return "待确认";
}

export function stringifyStringList(values: string[]): string {
  return JSON.stringify(values.map((value) => value.trim()).filter(Boolean));
}

export function parseStringList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function fitScoreLevel(score: number): {
  label: "极高" | "较高" | "中等" | "较低";
  className: string;
} {
  if (score >= 90) return { label: "极高", className: "fit-excellent" };
  if (score >= 75) return { label: "较高", className: "fit-high" };
  if (score >= 60) return { label: "中等", className: "fit-medium" };
  return { label: "较低", className: "fit-low" };
}

type VehicleRelevanceInput = {
  direction: string;
  majors: string[];
  skills: string[];
};

const VEHICLE_DIRECTIONS = [
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
];

const RELATED_MAJORS = [
  "车辆",
  "机械",
  "自动化",
  "控制",
  "电子",
  "计算机",
  "软件",
  "能源",
];

export function vehicleRelevance(input: VehicleRelevanceInput): {
  level: "高相关" | "中相关" | "低相关";
  className: "fit-high" | "fit-medium" | "fit-low";
  reasons: string[];
} {
  const reasons: string[] = [];
  const majorText = input.majors.join(" ");

  if (VEHICLE_DIRECTIONS.some((item) => input.direction.includes(item))) {
    reasons.push("岗位方向匹配");
  }
  if (RELATED_MAJORS.some((item) => majorText.includes(item))) {
    reasons.push("专业相关度");
  }
  if (VEHICLE_DIRECTIONS.some((item) => `${input.direction} ${majorText}`.includes(item))) {
    reasons.push("车辆工程关键词");
  }
  if (input.skills.filter(Boolean).length >= 2) {
    reasons.push("技能匹配");
  }

  if (reasons.length >= 3) {
    return { level: "高相关", className: "fit-high", reasons };
  }
  if (reasons.length === 2) {
    return { level: "中相关", className: "fit-medium", reasons };
  }
  return {
    level: "低相关",
    className: "fit-low",
    reasons: reasons.length ? reasons : ["公开信息不足"],
  };
}

const ADVICE_RULES: Array<{ keys: string[]; skills: string[] }> = [
  {
    keys: ["自动驾驶"],
    skills: ["C++", "Python", "感知算法", "规划控制", "车辆动力学"],
  },
  {
    keys: ["三电", "电池", "电机电控", "热管理"],
    skills: ["电池系统", "电机原理", "电控策略", "热管理", "新能源汽车基础"],
  },
  {
    keys: ["底盘", "整车研发"],
    skills: ["车辆动力学", "底盘结构", "悬架", "制动与转向", "仿真能力"],
  },
  {
    keys: ["嵌入式", "车载软件"],
    skills: ["C/C++", "CAN", "LIN", "车载以太网", "AUTOSAR", "Linux/RTOS"],
  },
  {
    keys: ["智能座舱"],
    skills: ["Qt", "Android", "HMI", "车机系统", "座舱域控制器"],
  },
];

export function generateVehicleAdvice(tags: string[], directions: string[]): string[] {
  const source = [...tags, ...directions].join(" ");
  const advice = ADVICE_RULES.flatMap((rule) =>
    rule.keys.some((key) => source.includes(key)) ? rule.skills : [],
  );
  return [...new Set(advice.length ? advice : ["车辆工程基础", "项目复盘", "岗位定向简历"])];
}

export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const isPlaceholder =
      hostname === "example.com" ||
      hostname.endsWith(".example.com") ||
      hostname === "localhost" ||
      hostname === "0.0.0.0" ||
      hostname === "127.0.0.1";
    return ["http:", "https:"].includes(parsed.protocol) && !isPlaceholder
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

export type LinkSourceType =
  | "COHORT_PROJECT"
  | "CAMPUS_PORTAL"
  | "CAREERS_SITE"
  | "OFFICIAL_ANNOUNCEMENT"
  | "TALENT_PAGE"
  | "COMPANY_WEBSITE"
  | "TRUSTED_THIRD_PARTY";

export type LinkHealthStatus =
  | "OK"
  | "BROWSER_ONLY"
  | "BLOCKED"
  | "REDIRECTED"
  | "DEAD"
  | "MANUAL_REVIEW";

export type LinkEvidenceInput = {
  url: string | null | undefined;
  healthStatus: string | null | undefined;
};

export function isUsableLinkEvidence(link: LinkEvidenceInput): boolean {
  return Boolean(
    safeExternalUrl(link.url)
    && ["OK", "BROWSER_ONLY", "REDIRECTED"].includes(link.healthStatus ?? ""),
  );
}

export function isCohortEvidence(
  link: LinkEvidenceInput & {
    sourceType: string | null | undefined;
    targetCohort: string | null | undefined;
    evidenceSummary: string | null | undefined;
  },
  cohort: number,
): boolean {
  if (!isUsableLinkEvidence(link)) return false;
  if (!["COHORT_PROJECT", "CAMPUS_PORTAL", "OFFICIAL_ANNOUNCEMENT"].includes(link.sourceType ?? "")) {
    return false;
  }
  const cohortText = `${link.targetCohort ?? ""} ${link.evidenceSummary ?? ""}`;
  return cohortText.includes(String(cohort));
}

export function linkSourceTypeLabel(value: string | null | undefined): string {
  return {
    COHORT_PROJECT: "2027 届具体项目",
    CAMPUS_PORTAL: "校园招聘门户",
    CAREERS_SITE: "通用招聘官网",
    OFFICIAL_ANNOUNCEMENT: "官方招聘公告",
    TALENT_PAGE: "企业人才介绍页",
    COMPANY_WEBSITE: "企业官网",
    TRUSTED_THIRD_PARTY: "第三方可信来源",
  }[value ?? ""] ?? "来源类型待确认";
}

export function linkHealthLabel(value: string | null | undefined): string {
  return {
    OK: "可正常访问",
    BROWSER_ONLY: "仅浏览器可访问",
    BLOCKED: "被反爬拦截",
    REDIRECTED: "已重定向",
    DEAD: "已失效",
    MANUAL_REVIEW: "待人工确认",
  }[value ?? ""] ?? "待人工确认";
}

export function externalDomain(url: string | null | undefined): string {
  const safeUrl = safeExternalUrl(url);
  return safeUrl ? new URL(safeUrl).hostname.replace(/^www\./, "") : "无有效域名";
}

export type EvidenceSourceType =
  | "OFFICIAL"
  | "SCHOOL"
  | "PUBLIC"
  | "EXPERIENCE"
  | "UNKNOWN";

export type DateConfidence = "VERIFIED" | "ESTIMATED" | "UNKNOWN";

export function normalizeSourceType(
  value: string | null | undefined,
  url?: string | null,
): EvidenceSourceType {
  if (!safeExternalUrl(url)) return value === "EXPERIENCE" || value === "候选人经验"
    ? "EXPERIENCE"
    : "UNKNOWN";

  const sourceMap: Record<string, EvidenceSourceType> = {
    OFFICIAL: "OFFICIAL",
    SCHOOL: "SCHOOL",
    PUBLIC: "PUBLIC",
    EXPERIENCE: "EXPERIENCE",
    UNKNOWN: "UNKNOWN",
    官方招聘站: "OFFICIAL",
    官方公众号: "OFFICIAL",
    学校就业网: "SCHOOL",
    公开整理: "PUBLIC",
    候选人经验: "EXPERIENCE",
  };
  return sourceMap[value ?? ""] ?? "UNKNOWN";
}

export function sourceTypeLabel(value: string | null | undefined): string {
  return {
    OFFICIAL: "官方招聘站",
    SCHOOL: "学校就业网",
    PUBLIC: "公开整理",
    EXPERIENCE: "候选人经验",
    UNKNOWN: "来源待补",
  }[value ?? "UNKNOWN"] ?? "来源待补";
}

type CalendarEvidenceEvent = {
  id: string;
  company: { id: string; name: string };
  eventType: string;
  eventDate: string | Date | null;
  sourceUrl: string | null;
  sourceType: string | null;
  verifiedAt: string | Date | null;
  dateConfidence: string | null;
};

export function hasVerifiedCalendarEvidence(event: CalendarEvidenceEvent): boolean {
  const sourceType = normalizeSourceType(event.sourceType, event.sourceUrl);
  const date = event.eventDate ? new Date(event.eventDate) : null;
  return Boolean(
    date
    && !Number.isNaN(date.getTime())
    && event.verifiedAt
    && event.dateConfidence === "VERIFIED"
    && ["OFFICIAL", "SCHOOL", "PUBLIC"].includes(sourceType)
    && safeExternalUrl(event.sourceUrl),
  );
}

export function groupCalendarEvents<T extends CalendarEvidenceEvent>(
  events: T[],
  now = new Date(),
): {
  sevenDays: T[];
  thirtyDays: T[];
  currentMonth: T[];
  pending: T[];
} {
  const uniqueEvents = [...new Map(events.map((event) => [event.id, event])).values()];
  const sevenDays: T[] = [];
  const thirtyDays: T[] = [];
  const currentMonth: T[] = [];
  const pendingByCompany = new Map<string, T>();

  for (const event of uniqueEvents) {
    if (!hasVerifiedCalendarEvidence(event)) {
      if (!pendingByCompany.has(event.company.id)) {
        pendingByCompany.set(event.company.id, event);
      }
      continue;
    }

    const eventDate = new Date(event.eventDate as string | Date);
    const daysAway = Math.ceil((eventDate.getTime() - now.getTime()) / DAY_MS);
    if (event.eventType === "网申截止" && daysAway >= 0 && daysAway <= 7) {
      sevenDays.push(event);
    } else if (event.eventType === "网申截止" && daysAway > 7 && daysAway <= 30) {
      thirtyDays.push(event);
    } else if (
      event.eventType === "网申开始"
      && eventDate.getUTCFullYear() === now.getUTCFullYear()
      && eventDate.getUTCMonth() === now.getUTCMonth()
    ) {
      currentMonth.push(event);
    }
  }

  return {
    sevenDays,
    thirtyDays,
    currentMonth,
    pending: [...pendingByCompany.values()],
  };
}
