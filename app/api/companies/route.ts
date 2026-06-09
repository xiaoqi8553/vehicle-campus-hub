import { companyInput, errorResponse } from "@/lib/api";
import { serializeCompany } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const status = searchParams.get("status")?.trim();
    const category = searchParams.get("category")?.trim();
    const companies = await prisma.company.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { cities: { contains: query } },
                { tags: { contains: query } },
                { fitDirections: { contains: query } },
              ],
            }
          : {}),
      },
      orderBy: { lastUpdatedAt: "desc" },
    });
    return Response.json({ data: companies.map(serializeCompany) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = companyInput.parse(await request.json());
    const company = await prisma.company.create({ data: input });
    return Response.json({ data: serializeCompany(company) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
