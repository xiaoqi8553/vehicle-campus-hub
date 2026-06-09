import { describe, expect, it } from "vitest";
import {
  determineRecruitmentStatus,
  fitScoreLevel,
  generateVehicleAdvice,
  parseStringList,
  stringifyStringList,
} from "@/lib/domain";

describe("determineRecruitmentStatus", () => {
  const now = new Date("2026-06-09T00:00:00.000Z");

  it("returns 未开始 before start date", () => {
    expect(
      determineRecruitmentStatus("2026-06-20", "2026-07-20", "", now),
    ).toBe("未开始");
  });

  it("returns 已结束 after end date", () => {
    expect(
      determineRecruitmentStatus("2026-05-01", "2026-06-01", "", now),
    ).toBe("已结束");
  });

  it("returns 即将截止 when the deadline is within seven days", () => {
    expect(
      determineRecruitmentStatus("2026-05-01", "2026-06-15", "", now),
    ).toBe("即将截止");
  });

  it("uses source text when dates are absent", () => {
    expect(determineRecruitmentStatus(null, null, "校园招聘正式启动", now)).toBe(
      "已开启",
    );
    expect(determineRecruitmentStatus(null, null, "敬请期待", now)).toBe(
      "未开始",
    );
    expect(determineRecruitmentStatus(null, null, "招聘结束", now)).toBe(
      "已结束",
    );
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

describe("fitScoreLevel", () => {
  it.each([
    [95, "极高"],
    [80, "较高"],
    [65, "中等"],
    [59, "较低"],
  ])("maps %i to %s", (score, level) => {
    expect(fitScoreLevel(score).label).toBe(level);
  });
});

describe("generateVehicleAdvice", () => {
  it("combines company tags and job directions without duplicates", () => {
    const advice = generateVehicleAdvice(
      ["自动驾驶", "嵌入式"],
      ["自动驾驶", "车载软件"],
    );
    expect(advice).toContain("C++");
    expect(advice).toContain("Python");
    expect(advice).toContain("CAN");
    expect(new Set(advice).size).toBe(advice.length);
  });
});
