import { calendarEventInput, errorResponse } from "@/lib/api";
import { serializeCalendarEvent } from "@/lib/data";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    const data = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!data) return Response.json({ error: "日历事件不存在" }, { status: 404 });
    return Response.json({ data: serializeCalendarEvent(data) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const input = calendarEventInput.partial().parse(await request.json());
    const data = await prisma.calendarEvent.update({ where: { id }, data: input });
    return Response.json({ data: serializeCalendarEvent(data) });
  } catch (error) {
    return errorResponse(error);
  }
}
