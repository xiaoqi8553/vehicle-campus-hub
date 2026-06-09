import type {
  CalendarEvent,
  Company,
  Job,
  Recruitment,
  Resource,
} from "@prisma/client";
import { parseStringList } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

export type CompanyCardData = ReturnType<typeof serializeCompany>;
export type RecruitmentData = ReturnType<typeof serializeRecruitment>;
export type JobData = ReturnType<typeof serializeJob>;
export type ResourceData = ReturnType<typeof serializeResource>;
export type CalendarEventData = ReturnType<typeof serializeCalendarEvent>;

export function serializeCompany(company: Company) {
  return {
    ...company,
    cities: parseStringList(company.cities),
    tags: parseStringList(company.tags),
    fitDirections: parseStringList(company.fitDirections),
    lastUpdatedAt: company.lastUpdatedAt.toISOString(),
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function serializeRecruitment(recruitment: Recruitment) {
  return {
    ...recruitment,
    startDate: recruitment.startDate?.toISOString() ?? null,
    endDate: recruitment.endDate?.toISOString() ?? null,
    createdAt: recruitment.createdAt.toISOString(),
    updatedAt: recruitment.updatedAt.toISOString(),
  };
}

export function serializeJob(job: Job) {
  return {
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

export function serializeResource(resource: Resource) {
  return {
    ...resource,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

export function serializeCalendarEvent(event: CalendarEvent) {
  return {
    ...event,
    eventDate: event.eventDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    orderBy: [{ lastUpdatedAt: "desc" }, { name: "asc" }],
  });
  return companies.map(serializeCompany);
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
    include: { company: true },
    orderBy: { eventDate: "asc" },
  });
  return events.map((event) => ({
    ...serializeCalendarEvent(event),
    company: serializeCompany(event.company),
  }));
}

export async function getAdminData() {
  const [companies, recruitments, jobs, resources] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.recruitment.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
    prisma.job.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
    prisma.resource.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
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
  };
}
