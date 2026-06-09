import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const officialResourceUrls: Record<string, string> = {
  "xiaomi-auto": "https://hr.xiaomi.com/",
  denso: "https://www.denso.com/cn/zh/careers/",
};

const interviewTitles = [
  "研发岗位技术面试复盘",
  "候选人面试流程与高频追问",
  "专业面与项目深挖准备清单",
  "技术岗位面试经验要点",
];

const interviewSummaries = [
  "汇总项目追问、专业基础、岗位理解与行为面试中的常见准备方向。",
  "梳理候选人分享的面试轮次、技术追问和项目复盘重点，内容仅供参考。",
  "围绕岗位基础、工程实践和问题分析能力整理准备清单，不代表企业题库。",
  "记录公开经验中反复出现的考察维度，建议结合目标岗位要求自行取舍。",
];

const guideTitles = [
  "校招入口与关键节点",
  "校园招聘投递信息整理",
  "网申流程与测评说明",
  "校招申请准备清单",
];

const guideSummaries = [
  "整理招聘入口、主要时间节点和申请前需要核对的信息。",
  "按公开渠道归纳网申、测评与面试流程，实际安排以企业通知为准。",
  "聚合投递路径与流程说明，提交前请在企业招聘官网再次确认。",
  "列出岗位检索、材料准备和流程跟进要点，避免把演示信息当作实时批次。",
];

async function main() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  for (const [index, company] of companies.entries()) {
    const resources = await prisma.resource.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "asc" },
    });
    const interview = resources.find((resource) => resource.type === "面经");
    const guide = resources.find((resource) => resource.type === "投递攻略");

    if (interview) {
      await prisma.resource.update({
        where: { id: interview.id },
        data: {
          title: `${company.name} ${interviewTitles[index % interviewTitles.length]}`,
          url: null,
          source: "候选人经验汇总（待核实）",
          summary: interviewSummaries[index % interviewSummaries.length],
          credibility: "经验参考",
        },
      });
    }

    if (guide) {
      const officialUrl = officialResourceUrls[company.id] ?? null;
      await prisma.resource.update({
        where: { id: guide.id },
        data: {
          title: `${company.name} ${guideTitles[index % guideTitles.length]}`,
          url: officialUrl,
          source: officialUrl ? "企业招聘官网" : "公开信息整理（待补链接）",
          summary: guideSummaries[index % guideSummaries.length],
          credibility: officialUrl ? "官方" : "较可信",
        },
      });
    }
  }

  const resources = await prisma.resource.findMany();
  console.log(JSON.stringify({
    total: resources.length,
    official: resources.filter((item) => item.credibility === "官方").length,
    trusted: resources.filter((item) => item.credibility === "较可信").length,
    experience: resources.filter((item) => item.credibility === "经验参考").length,
    emptyUrls: resources.filter((item) => !item.url).length,
    placeholderUrls: resources.filter((item) => item.url?.includes("example.com")).length,
    uniqueTitles: new Set(resources.map((item) => item.title)).size,
    uniqueSummaries: new Set(resources.map((item) => item.summary)).size,
  }, null, 2));
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
