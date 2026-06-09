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
