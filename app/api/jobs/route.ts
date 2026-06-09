import { errorResponse, jobInput } from "@/lib/api";
import { serializeJob } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const companyId = new URL(request.url).searchParams.get("companyId") ?? undefined;
    const data = await prisma.job.findMany({
      where: { companyId },
      orderBy: { vehicleFitScore: "desc" },
    });
    return Response.json({ data: data.map(serializeJob) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = jobInput.parse(await request.json());
    const data = await prisma.job.create({ data: input });
    return Response.json({ data: serializeJob(data) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
