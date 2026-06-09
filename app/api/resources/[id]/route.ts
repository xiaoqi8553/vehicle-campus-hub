import { errorResponse, resourceInput } from "@/lib/api";
import { serializeResource } from "@/lib/data";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const input = resourceInput.partial().parse(await request.json());
    const data = await prisma.resource.update({ where: { id }, data: input });
    return Response.json({ data: serializeResource(data) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    await prisma.resource.delete({ where: { id } });
    return Response.json({ data: { id } });
  } catch (error) {
    return errorResponse(error);
  }
}
