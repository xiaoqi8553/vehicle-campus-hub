import type {
  CalendarEvent,
  Company,
  Job,
  Recruitment,
  Resource,
} from "@prisma/client";
import { parseStringList } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

export type CompanyBaseData = ReturnType<typeof serializeCompany>;
export type RecruitmentData = ReturnType<typeof serializeRecruitment>;
export type JobData = ReturnType<typeof serializeJob>;
export type ResourceData = ReturnType<typeof serializeResource>;
export type CalendarEventData = ReturnType<typeof serializeCalendarEvent>;
export type CompanyCardData = CompanyBaseData & { recruitments?: RecruitmentData[] };

export function serializeCompany(company: Company) {
  const vehicleDirections = parseStringList(company.vehicleDirections).length
    ? parseStringList(company.vehicleDirections)
    : parseStringList(company.fitDirections);
  const companyType = company.type || company.category;
  const campusRecruitmentWebsite = company.campusRecruitmentWebsite || company.campusUrl;

  return {
    ...company,
    slug: company.slug || company.id,
    shortName: company.shortName || company.name,
    type: companyType,
    category: companyType,
    campusRecruitmentWebsite,
    campusUrl: campusRecruitmentWebsite,
    cities: parseStringList(company.cities),
    tags: parseStringList(company.tags),
    vehicleDirections,
    fitDirections: vehicleDirections,
    lastVerifiedAt: company.lastVerifiedAt?.toISOString() ?? null,
    lastUpdatedAt: company.lastUpdatedAt.toISOString(),
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function serializeRecruitment(recruitment: Recruitment) {
  return {
    ...recruitment,
    targetYear: recruitment.targetYear ?? recruitment.year,
    batch: recruitment.batch || recruitment.season,
    season: recruitment.batch || recruitment.season,
    notes: recruitment.notes || recruitment.note || null,
    sourceType: recruitment.sourceType || "公开整理",
    startDate: recruitment.startDate?.toISOString() ?? null,
    endDate: recruitment.endDate?.toISOString() ?? null,
    createdAt: recruitment.createdAt.toISOString(),
    updatedAt: recruitment.updatedAt.toISOString(),
  };
}

export function serializeJob(job: Job) {
  return {
    ...job,
    programId: job.programId || job.recruitmentId,
    majors: parseStringList(job.majors),
    skills: parseStringList(job.skills),
    matchScore: job.matchScore ?? job.vehicleFitScore,
    vehicleFitScore: job.matchScore ?? job.vehicleFitScore,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

export function serializeResource(resource: Resource) {
  return {
    ...resource,
    sourceUrl: resource.sourceUrl || resource.url,
    url: resource.sourceUrl || resource.url,
    sourceType: resource.sourceType || resource.source,
    tags: parseStringList(resource.tags),
    targetYear: resource.targetYear ?? 2027,
    sourceYear: resource.sourceYear ?? 2026,
    lastVerifiedAt: resource.lastVerifiedAt?.toISOString() ?? null,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

export function serializeCalendarEvent(event: CalendarEvent) {
  return {
    ...event,
    programId: event.programId || event.recruitmentId,
    eventDate: event.eventDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    include: { recruitments: { orderBy: { updatedAt: "desc" } } },
    orderBy: [{ lastUpdatedAt: "desc" }, { name: "asc" }],
  });
  return companies.map((company) => ({
    ...serializeCompany(company),
    recruitments: company.recruitments.map(serializeRecruitment),
  }));
}

export async function getCompanyDetail(id: string) {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      recruitments: { orderBy: { startDate: "desc" } },
      jobs: { orderBy: { vehicleFitScore: "desc" } },
      resources: { orderBy: { createdAt: "desc" } },
      calendarEvents: { orderBy: { eventDate: "asc" } },
    },
  }) ?? await prisma.company.findUnique({
    where: { slug: id },
    include: {
      recruitments: { orderBy: { startDate: "desc" } },
      jobs: { orderBy: { vehicleFitScore: "desc" } },
      resources: { orderBy: { createdAt: "desc" } },
      calendarEvents: { orderBy: { eventDate: "asc" } },
    },
  });
  if (!company) return null;
  return {
    ...serializeCompany(company),
    recruitments: company.recruitments.map(serializeRecruitment),
    jobs: company.jobs.map(serializeJob),
    resources: company.resources.map(serializeResource),
    calendarEvents: company.calendarEvents.map(serializeCalendarEvent),
  };
}

export async function getResources() {
  const resources = await prisma.resource.findMany({
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });
  return resources.map((resource) => ({
    ...serializeResource(resource),
    company: serializeCompany(resource.company),
  }));
}

export async function getCalendarEvents() {
  const events = await prisma.calendarEvent.findMany({
    include: { company: true, recruitment: true },
    orderBy: { eventDate: "asc" },
  });
  return events.map((event) => ({
    ...serializeCalendarEvent(event),
    company: serializeCompany(event.company),
    recruitment: event.recruitment ? serializeRecruitment(event.recruitment) : null,
  }));
}

export async function getAdminData() {
  const [companies, recruitments, jobs, resources, calendarEvents] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.recruitment.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
    prisma.job.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
    prisma.resource.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
    prisma.calendarEvent.findMany({ include: { company: true }, orderBy: { eventDate: "asc" } }),
  ]);
  return {
    companies: companies.map(serializeCompany),
    recruitments: recruitments.map((item) => ({
      ...serializeRecruitment(item),
      companyName: item.company.name,
    })),
    jobs: jobs.map((item) => ({
      ...serializeJob(item),
      companyName: item.company.name,
    })),
    resources: resources.map((item) => ({
      ...serializeResource(item),
      companyName: item.company.name,
    })),
    calendarEvents: calendarEvents.map((item) => ({
      ...serializeCalendarEvent(item),
      companyName: item.company.name,
    })),
  };
}
