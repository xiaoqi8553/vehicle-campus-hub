import { describe, expect, it } from "vitest";
import {
  determineRecruitmentStatus,
  generateVehicleAdvice,
  groupCalendarEvents,
  isCohortEvidence,
  isUsableLinkEvidence,
  parseStringList,
  safeExternalUrl,
  stringifyStringList,
  vehicleRelevance,
} from "@/lib/domain";

describe("determineRecruitmentStatus", () => {
  const now = new Date("2026-06-09T00:00:00.000Z");

  it("returns 未开始 before start date", () => {
    expect(determineRecruitmentStatus("2026-06-20", "2026-07-20", "", now)).toBe("未开始");
  });

  it("returns 已结束 after end date", () => {
    expect(determineRecruitmentStatus("2026-05-01", "2026-06-01", "", now)).toBe("已结束");
  });

  it("returns 即将截止 when the deadline is within seven days", () => {
    expect(determineRecruitmentStatus("2026-05-01", "2026-06-15", "", now)).toBe("即将截止");
  });

  it("uses source text when dates are absent", () => {
    expect(determineRecruitmentStatus(null, null, "校园招聘正式启动", now)).toBe("已开启");
    expect(determineRecruitmentStatus(null, null, "敬请期待", now)).toBe("未开始");
    expect(determineRecruitmentStatus(null, null, "招聘结束", now)).toBe("已结束");
  });

  it("returns 待确认 when no rule matches", () => {
    expect(determineRecruitmentStatus(null, null, "", now)).toBe("待确认");
  });
});

describe("string list persistence", () => {
  it("round trips arrays and safely handles malformed data", () => {
    const source = ["上海", "北京"];
    expect(parseStringList(stringifyStringList(source))).toEqual(source);
    expect(parseStringList("not-json")).toEqual([]);
    expect(parseStringList(null)).toEqual([]);
  });
});

describe("vehicleRelevance", () => {
  it("returns an explainable level instead of an unexplained exact score", () => {
    expect(
      vehicleRelevance({
        direction: "自动驾驶",
        majors: ["车辆工程", "自动化"],
        skills: ["C++", "Python", "仿真评测"],
      }),
    ).toEqual({
      level: "高相关",
      className: "fit-high",
      reasons: ["岗位方向匹配", "专业相关度", "车辆工程关键词", "技能匹配"],
    });
  });
});

describe("groupCalendarEvents", () => {
  const now = new Date("2026-06-10T00:00:00.000Z");
  const base = {
    company: { id: "xiaomi-auto", name: "小米汽车" },
    eventType: "网申截止",
    sourceUrl: "https://hr.xiaomi.com/",
    sourceType: "OFFICIAL",
    verifiedAt: "2026-06-10T00:00:00.000Z",
    dateConfidence: "VERIFIED",
  };

  it("places each verified event in only one time group", () => {
    const event = {
      ...base,
      id: "verified-deadline",
      eventDate: "2026-06-16T00:00:00.000Z",
    };
    const groups = groupCalendarEvents([event], now);
    expect(groups.sevenDays.map((item) => item.id)).toEqual(["verified-deadline"]);
    expect(groups.thirtyDays).toEqual([]);
    expect(groups.currentMonth).toEqual([]);
    expect(groups.pending).toEqual([]);
  });

  it("keeps unverified dates in a company-level observation list", () => {
    const events = [
      {
        ...base,
        id: "pending-one",
        eventDate: "2026-06-12T00:00:00.000Z",
        sourceUrl: null,
        sourceType: "UNKNOWN",
        verifiedAt: null,
        dateConfidence: "UNKNOWN",
      },
      {
        ...base,
        id: "pending-two",
        eventDate: "2026-06-18T00:00:00.000Z",
        sourceUrl: null,
        sourceType: "UNKNOWN",
        verifiedAt: null,
        dateConfidence: "UNKNOWN",
      },
    ];
    const groups = groupCalendarEvents(events, now);
    expect(groups.sevenDays).toEqual([]);
    expect(groups.pending).toHaveLength(1);
    expect(groups.pending[0].company.id).toBe("xiaomi-auto");
  });
});

describe("generateVehicleAdvice", () => {
  it("combines company tags and job directions without duplicates", () => {
    const advice = generateVehicleAdvice(["自动驾驶", "嵌入式"], ["自动驾驶", "车载软件"]);
    expect(advice).toContain("C++");
    expect(advice).toContain("Python");
    expect(advice).toContain("CAN");
    expect(new Set(advice).size).toBe(advice.length);
  });
});

describe("safeExternalUrl", () => {
  it("accepts real http links and rejects placeholders or unsafe values", () => {
    expect(safeExternalUrl("https://careers.example.org/campus")).toBe(
      "https://careers.example.org/campus",
    );
    expect(safeExternalUrl("https://example.com/demo")).toBeNull();
    expect(safeExternalUrl("https://www.example.com/demo")).toBeNull();
    expect(safeExternalUrl("#")).toBeNull();
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(safeExternalUrl("")).toBeNull();
  });
});

describe("link evidence", () => {
  it("does not treat dead, blocked or placeholder URLs as usable evidence", () => {
    expect(
      isUsableLinkEvidence({
        url: "https://hr.xiaomi.com/campus/0",
        healthStatus: "DEAD",
      }),
    ).toBe(false);
    expect(
      isUsableLinkEvidence({
        url: "https://www.tesla.cn/careers",
        healthStatus: "BLOCKED",
      }),
    ).toBe(false);
    expect(
      isUsableLinkEvidence({
        url: "https://example.com/campus",
        healthStatus: "OK",
      }),
    ).toBe(false);
    expect(
      isUsableLinkEvidence({
        url: "https://hr.xiaomi.com/campus",
        healthStatus: "OK",
      }),
    ).toBe(true);
  });

  it("requires cohort-specific evidence before counting a 2027 opening", () => {
    expect(
      isCohortEvidence(
        {
          sourceType: "CAREERS_SITE",
          targetCohort: "不限",
          evidenceSummary: "企业通用招聘官网。",
          healthStatus: "OK",
          url: "https://jobs.zf.com/?locale=zh_CN",
        },
        2027,
      ),
    ).toBe(false);
    expect(
      isCohortEvidence(
        {
          sourceType: "CAMPUS_PORTAL",
          targetCohort: "2027",
          evidenceSummary: "官方页面明确列出面向 2027 届的实习项目。",
          healthStatus: "OK",
          url: "https://hr.xiaomi.com/campus",
        },
        2027,
      ),
    ).toBe(true);
  });
});
