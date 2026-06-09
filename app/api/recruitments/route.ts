import { errorResponse, recruitmentInput } from "@/lib/api";
import { serializeRecruitment } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const companyId = new URL(request.url).searchParams.get("companyId") ?? undefined;
    const data = await prisma.recruitment.findMany({
      where: { companyId },
      orderBy: { startDate: "desc" },
    });
    return Response.json({ data: data.map(serializeRecruitment) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = recruitmentInput.parse(await request.json());
    const data = await prisma.recruitment.create({ data: input });
    return Response.json({ data: serializeRecruitment(data) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
