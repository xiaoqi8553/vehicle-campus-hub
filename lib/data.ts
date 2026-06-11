import type {
  CalendarEvent,
  Company,
  CompanyLink,
  Job,
  Recruitment,
  Resource,
} from "@prisma/client";
import {
  isCohortEvidence,
  normalizeSourceType,
  parseStringList,
  safeExternalUrl,
} from "@/lib/domain";
import { prisma } from "@/lib/prisma";

export type CompanyBaseData = ReturnType<typeof serializeCompany>;
export type RecruitmentData = ReturnType<typeof serializeRecruitment>;
export type JobData = ReturnType<typeof serializeJob>;
export type ResourceData = ReturnType<typeof serializeResource>;
export type CalendarEventData = ReturnType<typeof serializeCalendarEvent>;
export type CompanyLinkData = ReturnType<typeof serializeCompanyLink>;
export type CompanyCardData = CompanyBaseData & {
  recruitments?: Array<RecruitmentData & { sourceLink?: CompanyLinkData | null }>;
  links?: CompanyLinkData[];
};

export function serializeCompanyLink(link: CompanyLink) {
  return {
    ...link,
    url: safeExternalUrl(link.url),
    finalUrl: safeExternalUrl(link.finalUrl),
    verifiedAt: link.verifiedAt?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  };
}

export function serializeCompany(company: Company) {
  const vehicleDirections = parseStringList(company.vehicleDirections).length
    ? parseStringList(company.vehicleDirections)
    : parseStringList(company.fitDirections);
  const companyType = company.type || company.category;
  const campusRecruitmentWebsite = company.campusRecruitmentWebsite || company.campusUrl;
  const recruitmentWebsite = company.recruitmentWebsite || campusRecruitmentWebsite;
  const sourceUrl =
    safeExternalUrl(company.sourceUrl) ??
    safeExternalUrl(recruitmentWebsite) ??
    safeExternalUrl(company.officialWebsite);
  const sourceType = normalizeSourceType(company.sourceType, sourceUrl);

  return {
    ...company,
    slug: company.slug || company.id,
    shortName: company.shortName || company.name,
    type: companyType,
    category: companyType,
    recruitmentWebsite,
    campusRecruitmentWebsite,
    campusUrl: campusRecruitmentWebsite,
    sourceUrl,
    sourceType,
    cities: parseStringList(company.cities),
    tags: parseStringList(company.tags),
    vehicleDirections,
    fitDirections: vehicleDirections,
    lastVerifiedAt: company.lastVerifiedAt?.toISOString() ?? null,
    verifiedAt: company.verifiedAt?.toISOString() ?? null,
    lastUpdatedAt: company.lastUpdatedAt.toISOString(),
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function serializeRecruitment(recruitment: Recruitment) {
  const sourceUrl = safeExternalUrl(recruitment.sourceUrl);
  const sourceType = normalizeSourceType(recruitment.sourceType, sourceUrl);
  return {
    ...recruitment,
    targetYear: recruitment.targetYear ?? recruitment.year,
    batch: recruitment.batch || recruitment.season,
    season: recruitment.batch || recruitment.season,
    notes: recruitment.notes || recruitment.note || null,
    sourceUrl,
    sourceType,
    credibility: sourceType === "UNKNOWN" ? "待核实" : recruitment.credibility,
    verifiedAt: recruitment.verifiedAt?.toISOString() ?? null,
    startDate: recruitment.startDate?.toISOString() ?? null,
    endDate: recruitment.endDate?.toISOString() ?? null,
    createdAt: recruitment.createdAt.toISOString(),
    updatedAt: recruitment.updatedAt.toISOString(),
  };
}

export function serializeJob(job: Job) {
  const sourceUrl = safeExternalUrl(job.sourceUrl);
  return {
    ...job,
    programId: job.programId || job.recruitmentId,
    majors: parseStringList(job.majors),
    skills: parseStringList(job.skills),
    sourceUrl,
    sourceType: normalizeSourceType(job.sourceType, sourceUrl),
    verifiedAt: job.verifiedAt?.toISOString() ?? null,
    matchScore: job.matchScore ?? job.vehicleFitScore,
    vehicleFitScore: job.matchScore ?? job.vehicleFitScore,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

export function serializeResource(resource: Resource) {
  const sourceUrl = safeExternalUrl(resource.sourceUrl || resource.url);
  const sourceType = normalizeSourceType(resource.sourceType || resource.source, sourceUrl);
  return {
    ...resource,
    sourceUrl,
    url: sourceUrl,
    sourceType,
    credibility: sourceType === "UNKNOWN" ? "待核实" : resource.credibility,
    tags: parseStringList(resource.tags),
    targetYear: resource.targetYear ?? 2027,
    sourceYear: resource.sourceYear ?? 2026,
    content: (() => {
      try {
        const parsed: unknown = JSON.parse(resource.content);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })() as Array<{ heading: string; paragraphs: string[]; checklist: string[] }>,
    lastVerifiedAt: resource.lastVerifiedAt?.toISOString() ?? null,
    verifiedAt: resource.verifiedAt?.toISOString() ?? null,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

export function serializeCalendarEvent(event: CalendarEvent) {
  const sourceUrl = safeExternalUrl(event.sourceUrl);
  const sourceType = normalizeSourceType(event.sourceType, sourceUrl);
  return {
    ...event,
    programId: event.programId || event.recruitmentId,
    eventDate: event.eventDate?.toISOString() ?? null,
    sourceUrl,
    sourceType,
    status:
      sourceType === "UNKNOWN" || event.dateConfidence !== "VERIFIED" ? "待确认" : event.status,
    credibility: sourceType === "UNKNOWN" ? "待核实" : event.credibility,
    verifiedAt: event.verifiedAt?.toISOString() ?? null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    include: {
      links: { orderBy: [{ isPrimary: "desc" }, { sourceType: "asc" }] },
      recruitments: {
        include: { sourceLink: true },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });
  return companies
    .map((company) => ({
      ...serializeCompany(company),
      links: company.links.map(serializeCompanyLink),
      recruitments: company.recruitments.map((recruitment) => ({
        ...serializeRecruitment(recruitment),
        sourceLink: recruitment.sourceLink ? serializeCompanyLink(recruitment.sourceLink) : null,
      })),
    }))
    .sort((a, b) => {
      const aOpen =
        a.links.some((link) => isCohortEvidence(link, 2027)) &&
        a.recruitments.some((item) => item.targetYear === 2027 && item.status.includes("开放"));
      const bOpen =
        b.links.some((link) => isCohortEvidence(link, 2027)) &&
        b.recruitments.some((item) => item.targetYear === 2027 && item.status.includes("开放"));
      if (aOpen !== bOpen) return Number(bOpen) - Number(aOpen);
      const latest = (links: CompanyLinkData[]) =>
        Math.max(0, ...links.map((link) => (link.verifiedAt ? Date.parse(link.verifiedAt) : 0)));
      return latest(b.links) - latest(a.links) || a.name.localeCompare(b.name, "zh-CN");
    });
}

export async function getCompanyDetail(id: string) {
  const company =
    (await prisma.company.findUnique({
      where: { id },
      include: {
        links: { orderBy: [{ isPrimary: "desc" }, { sourceType: "asc" }] },
        recruitments: { include: { sourceLink: true }, orderBy: { startDate: "desc" } },
        jobs: { orderBy: { vehicleFitScore: "desc" } },
        resources: { orderBy: { createdAt: "desc" } },
        calendarEvents: { orderBy: { eventDate: "asc" } },
      },
    })) ??
    (await prisma.company.findUnique({
      where: { slug: id },
      include: {
        links: { orderBy: [{ isPrimary: "desc" }, { sourceType: "asc" }] },
        recruitments: { include: { sourceLink: true }, orderBy: { startDate: "desc" } },
        jobs: { orderBy: { vehicleFitScore: "desc" } },
        resources: { orderBy: { createdAt: "desc" } },
        calendarEvents: { orderBy: { eventDate: "asc" } },
      },
    }));
  if (!company) return null;
  return {
    ...serializeCompany(company),
    links: company.links.map(serializeCompanyLink),
    recruitments: company.recruitments.map((recruitment) => ({
      ...serializeRecruitment(recruitment),
      sourceLink: recruitment.sourceLink ? serializeCompanyLink(recruitment.sourceLink) : null,
    })),
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
    company: resource.company ? serializeCompany(resource.company) : null,
  }));
}

export async function getResource(id: string) {
  const resource = await prisma.resource.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!resource) return null;
  return {
    ...serializeResource(resource),
    company: resource.company ? serializeCompany(resource.company) : null,
  };
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
      companyName: item.company?.name ?? "公共资料",
    })),
    calendarEvents: calendarEvents.map((item) => ({
      ...serializeCalendarEvent(item),
      companyName: item.company.name,
    })),
  };
}
