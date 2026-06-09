import { z } from "zod";
import { stringifyStringList } from "@/lib/domain";

const stringList = z.union([z.array(z.string()), z.string()]).transform((value) =>
  Array.isArray(value)
    ? stringifyStringList(value)
    : stringifyStringList(value.split(",").map((item) => item.trim())),
);

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

export const companyInput = z.object({
  name: z.string().trim().min(1, "公司名称不能为空"),
  category: z.string().trim().min(1, "公司类型不能为空"),
  description: z.string().trim().min(1, "公司简介不能为空"),
  logo: optionalUrl,
  officialWebsite: optionalUrl,
  campusUrl: optionalUrl,
  cities: stringList,
  tags: stringList,
  status: z.string().trim().min(1),
  fitDirections: stringList,
});

export const recruitmentInput = z.object({
  companyId: z.string().min(1, "请选择公司"),
  year: z.coerce.number().int().min(2020).max(2100),
  season: z.string().min(1),
  title: z.string().min(1),
  status: z.string().min(1),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  applyUrl: optionalUrl,
  process: z.string().min(1),
  note: z.string().nullable().optional(),
  sourceUrl: optionalUrl,
  credibility: z.string().min(1),
});

export const jobInput = z.object({
  companyId: z.string().min(1, "请选择公司"),
  recruitmentId: z.string().nullable().optional(),
  title: z.string().min(1),
  direction: z.string().min(1),
  city: z.string().min(1),
  education: z.string().min(1),
  majorRequirement: z.string().min(1),
  applyUrl: optionalUrl,
  vehicleFitScore: z.coerce.number().int().min(0).max(100),
});

export const resourceInput = z.object({
  companyId: z.string().min(1, "请选择公司"),
  title: z.string().min(1),
  type: z.string().min(1),
  url: optionalUrl,
  source: z.string().min(1),
  summary: z.string().min(1),
  credibility: z.string().min(1),
});

export const calendarEventInput = z.object({
  companyId: z.string().min(1, "请选择公司"),
  recruitmentId: z.string().nullable().optional(),
  title: z.string().min(1),
  eventType: z.string().min(1),
  eventDate: z.coerce.date(),
  status: z.string().min(1),
});

export function errorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return Response.json({ error: error.issues[0]?.message ?? "请求参数错误" }, { status: 400 });
  }
  console.error(error);
  return Response.json({ error: "服务器处理请求失败" }, { status: 500 });
}
