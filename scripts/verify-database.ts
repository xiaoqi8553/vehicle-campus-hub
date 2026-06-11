import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [companies, links, recruitments, jobs, resources, users, favorites, calendarEvents] =
    await Promise.all([
      prisma.company.count(),
      prisma.companyLink.count(),
      prisma.recruitment.count(),
      prisma.job.count(),
      prisma.resource.count(),
      prisma.user.count(),
      prisma.favorite.count(),
      prisma.calendarEvent.count(),
    ]);

  const minimums = {
    companies: Number(process.env.EXPECTED_COMPANIES ?? 25),
    links: Number(process.env.EXPECTED_COMPANY_LINKS ?? 51),
    recruitments: Number(process.env.EXPECTED_RECRUITMENTS ?? 3),
    resources: Number(process.env.EXPECTED_RESOURCES ?? 6),
  };
  const counts = {
    companies,
    links,
    recruitments,
    jobs,
    resources,
    users,
    favorites,
    calendarEvents,
  };
  const failures = Object.entries(minimums)
    .filter(([key, expected]) => counts[key as keyof typeof counts] < expected)
    .map(
      ([key, expected]) =>
        `${key}: expected at least ${expected}, found ${counts[key as keyof typeof counts]}`,
    );

  const recruitmentLinks = await prisma.recruitment.findMany({
    select: {
      companyId: true,
      sourceLink: { select: { companyId: true } },
    },
  });
  const crossCompanyLinks = recruitmentLinks.filter(
    ({ companyId, sourceLink }) => sourceLink && sourceLink.companyId !== companyId,
  );
  if (crossCompanyLinks.length > 0) {
    failures.push(
      `${crossCompanyLinks.length} recruitments reference another company's source link`,
    );
  }

  const companiesWithoutLinks = await prisma.company.count({ where: { links: { none: {} } } });
  if (companiesWithoutLinks > 0) {
    failures.push(`${companiesWithoutLinks} companies have no evidence links`);
  }

  console.log(JSON.stringify({ counts, minimums, companiesWithoutLinks }, null, 2));
  if (failures.length > 0) throw new Error(`Database verification failed:\n${failures.join("\n")}`);
}

main()
  .finally(async () => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
