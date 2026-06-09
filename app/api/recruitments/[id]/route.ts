import { errorResponse, recruitmentInput } from "@/lib/api";
import { serializeRecruitment } from "@/lib/data";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const input = recruitmentInput.partial().parse(await request.json());
    const data = await prisma.recruitment.update({ where: { id }, data: input });
    return Response.json({ data: serializeRecruitment(data) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    await prisma.recruitment.delete({ where: { id } });
    return Response.json({ data: { id } });
  } catch (error) {
    return errorResponse(error);
  }
}
