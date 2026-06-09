import { calendarEventInput, errorResponse } from "@/lib/api";
import { serializeCalendarEvent } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const companyId = new URL(request.url).searchParams.get("companyId") ?? undefined;
    const data = await prisma.calendarEvent.findMany({
      where: { companyId },
      orderBy: { eventDate: "asc" },
    });
    return Response.json({ data: data.map(serializeCalendarEvent) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = calendarEventInput.parse(await request.json());
    const data = await prisma.calendarEvent.create({ data: input });
    return Response.json({ data: serializeCalendarEvent(data) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
