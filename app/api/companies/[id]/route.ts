import { companyInput, errorResponse } from "@/lib/api";
import {
  serializeCalendarEvent,
  serializeCompany,
  serializeJob,
  serializeRecruitment,
  serializeResource,
} from "@/lib/data";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: { recruitments: true, jobs: true, resources: true, calendarEvents: true },
    });
    if (!company) return Response.json({ error: "公司不存在" }, { status: 404 });
    return Response.json({
      data: {
        ...serializeCompany(company),
        recruitments: company.recruitments.map(serializeRecruitment),
        jobs: company.jobs.map(serializeJob),
        resources: company.resources.map(serializeResource),
        calendarEvents: company.calendarEvents.map(serializeCalendarEvent),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const input = companyInput.partial().parse(await request.json());
    const company = await prisma.company.update({
      where: { id },
      data: { ...input, lastUpdatedAt: new Date() },
    });
    return Response.json({ data: serializeCompany(company) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    await prisma.company.delete({ where: { id } });
    return Response.json({ data: { id } });
  } catch (error) {
    return errorResponse(error);
  }
}
