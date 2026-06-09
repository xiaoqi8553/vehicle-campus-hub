import { errorResponse, resourceInput } from "@/lib/api";
import { serializeResource } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const companyId = new URL(request.url).searchParams.get("companyId") ?? undefined;
    const data = await prisma.resource.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ data: data.map(serializeResource) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = resourceInput.parse(await request.json());
    const data = await prisma.resource.create({ data: input });
    return Response.json({ data: serializeResource(data) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
