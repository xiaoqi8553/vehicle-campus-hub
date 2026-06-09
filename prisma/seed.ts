import { PrismaClient } from "@prisma/client";
import { stringifyStringList } from "../lib/domain";

const prisma = new PrismaClient();

type SeedCompany = {
  id: string;
  name: string;
  category: string;
  cities: string[];
  tags: string[];
  directions: string[];
  status: string;
};

const companies: SeedCompany[] = [
  { id: "xiaomi-auto", name: "小米汽车", category: "新势力", cities: ["北京", "上海"], tags: ["智能电动", "自动驾驶", "智能座舱"], directions: ["自动驾驶", "智能座舱", "三电"], status: "已开启" },
  { id: "li-auto", name: "理想汽车", category: "新势力", cities: ["北京", "上海", "常州"], tags: ["增程", "智能驾驶", "整车研发"], directions: ["整车研发", "自动驾驶", "底盘"], status: "已开启" },
  { id: "nio", name: "蔚来", category: "新势力", cities: ["上海", "合肥"], tags: ["智能电动", "换电", "车载软件"], directions: ["三电", "车载软件", "整车研发"], status: "即将截止" },
  { id: "xpeng", name: "小鹏汽车", category: "新势力", cities: ["广州", "上海"], tags: ["自动驾驶", "智能座舱"], directions: ["自动驾驶", "智能座舱", "车载软件"], status: "已开启" },
  { id: "leapmotor", name: "零跑汽车", category: "新势力", cities: ["杭州", "金华"], tags: ["全域自研", "三电"], directions: ["三电", "整车研发", "测试验证"], status: "未开始" },
  { id: "zeekr", name: "极氪", category: "新势力", cities: ["杭州", "宁波"], tags: ["纯电", "智能座舱"], directions: ["整车研发", "智能座舱", "底盘"], status: "已开启" },
  { id: "tesla", name: "特斯拉", category: "外资车企", cities: ["上海", "北京"], tags: ["智能制造", "电池", "自动驾驶"], directions: ["制造工艺", "电池", "自动驾驶"], status: "待确认" },
  { id: "byd", name: "比亚迪", category: "传统车企", cities: ["深圳", "西安", "合肥"], tags: ["电池", "电机电控", "整车研发"], directions: ["电池", "电机电控", "整车研发"], status: "已开启" },
  { id: "geely", name: "吉利汽车", category: "传统车企", cities: ["杭州", "宁波"], tags: ["整车研发", "智能化"], directions: ["整车研发", "底盘", "智能座舱"], status: "即将截止" },
  { id: "changan", name: "长安汽车", category: "传统车企", cities: ["重庆", "上海"], tags: ["整车研发", "新能源"], directions: ["整车研发", "三电", "CAE仿真"], status: "已开启" },
  { id: "gac", name: "广汽集团", category: "传统车企", cities: ["广州"], tags: ["新能源", "智能网联"], directions: ["整车研发", "车身", "车载软件"], status: "未开始" },
  { id: "saic", name: "上汽集团", category: "传统车企", cities: ["上海"], tags: ["整车研发", "软件汽车"], directions: ["整车研发", "车载软件", "测试验证"], status: "已结束" },
  { id: "faw", name: "一汽集团", category: "传统车企", cities: ["长春", "南京"], tags: ["整车研发", "智能制造"], directions: ["整车研发", "底盘", "制造工艺"], status: "待确认" },
  { id: "dongfeng", name: "东风汽车", category: "传统车企", cities: ["武汉"], tags: ["整车研发", "新能源"], directions: ["动力总成", "三电", "测试验证"], status: "已开启" },
  { id: "great-wall", name: "长城汽车", category: "传统车企", cities: ["保定", "上海"], tags: ["越野", "智能化"], directions: ["底盘", "动力总成", "自动驾驶"], status: "即将截止" },
  { id: "catl", name: "宁德时代", category: "电池三电", cities: ["宁德", "上海", "溧阳"], tags: ["电池", "储能", "热管理"], directions: ["电池", "热管理", "测试验证"], status: "已开启" },
  { id: "calb", name: "中创新航", category: "电池三电", cities: ["常州", "成都"], tags: ["动力电池", "材料"], directions: ["电池", "制造工艺", "热管理"], status: "未开始" },
  { id: "bosch", name: "博世", category: "零部件", cities: ["苏州", "上海", "无锡"], tags: ["底盘", "电控", "自动驾驶"], directions: ["底盘", "电机电控", "自动驾驶"], status: "已开启" },
  { id: "continental", name: "大陆集团", category: "零部件", cities: ["上海", "芜湖"], tags: ["智能座舱", "底盘", "车载软件"], directions: ["智能座舱", "底盘", "嵌入式"], status: "待确认" },
  { id: "zf", name: "采埃孚", category: "零部件", cities: ["上海", "杭州"], tags: ["传动", "底盘", "安全"], directions: ["动力总成", "底盘", "测试验证"], status: "已结束" },
  { id: "denso", name: "电装", category: "零部件", cities: ["上海", "广州"], tags: ["热管理", "电装系统"], directions: ["热管理", "电机电控", "嵌入式"], status: "已开启" },
  { id: "horizon", name: "地平线", category: "智能化供应商", cities: ["北京", "上海"], tags: ["自动驾驶", "车规芯片", "嵌入式"], directions: ["自动驾驶", "嵌入式", "车载软件"], status: "已开启" },
  { id: "momenta", name: "Momenta", category: "自动驾驶", cities: ["苏州", "上海", "北京"], tags: ["自动驾驶", "数据闭环"], directions: ["自动驾驶", "测试验证", "车载软件"], status: "即将截止" },
  { id: "jingwei-hirain", name: "经纬恒润", category: "智能化供应商", cities: ["北京", "天津", "上海"], tags: ["嵌入式", "车载软件", "智能驾驶"], directions: ["嵌入式", "车载软件", "测试验证"], status: "已开启" },
  { id: "hesai", name: "禾赛科技", category: "智能化供应商", cities: ["上海"], tags: ["激光雷达", "自动驾驶", "光机电"], directions: ["自动驾驶", "嵌入式", "测试验证"], status: "未开始" },
];

const startDates: Record<string, string> = {
  未开始: "2026-07-01",
  已开启: "2026-05-20",
  即将截止: "2026-05-10",
  已结束: "2026-03-01",
  待确认: "2026-06-01",
};

const endDates: Record<string, string> = {
  未开始: "2026-08-15",
  已开启: "2026-07-20",
  即将截止: "2026-06-14",
  已结束: "2026-04-01",
  待确认: "2026-08-01",
};

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruitment.deleteMany();
  await prisma.company.deleteMany();

  for (const [index, item] of companies.entries()) {
    const company = await prisma.company.create({
      data: {
        id: item.id,
        name: item.name,
        category: item.category,
        description: `${item.name}在车辆研发、智能化与新能源产业链拥有代表性业务。本页为校招聚合示例，请以企业官方招聘网站为准。`,
        officialWebsite: index % 6 === 0 ? null : `https://example.com/${item.id}`,
        campusUrl: index % 5 === 0 ? null : `https://example.com/${item.id}/campus`,
        cities: stringifyStringList(item.cities),
        tags: stringifyStringList(item.tags),
        status: item.status,
        fitDirections: stringifyStringList(item.directions),
        lastUpdatedAt: new Date(`2026-06-${String((index % 8) + 1).padStart(2, "0")}T08:00:00Z`),
      },
    });

    const recruitment = await prisma.recruitment.create({
      data: {
        companyId: company.id,
        year: 2027,
        season: index % 3 === 0 ? "提前批" : index % 3 === 1 ? "秋招" : "实习",
        title: `${item.name} 2027 届校园招聘`,
        status: item.status,
        startDate: new Date(`${startDates[item.status]}T00:00:00Z`),
        endDate: new Date(`${endDates[item.status]}T23:59:59Z`),
        applyUrl: index % 5 === 0 ? null : `https://example.com/${item.id}/apply`,
        process: "网申 → 测评 → 笔试 → 技术面 → HR面 → Offer",
        note: "岗位和批次可能动态调整，请关注官方通知。",
        sourceUrl: `https://example.com/${item.id}/source`,
        credibility: index % 4 === 0 ? "官方" : "较可信",
      },
    });

    await prisma.job.createMany({
      data: item.directions.slice(0, 2).map((direction, jobIndex) => ({
        companyId: company.id,
        recruitmentId: recruitment.id,
        title: `${direction}${jobIndex === 0 ? "研发工程师" : "测试工程师"}`,
        direction,
        city: item.cities[jobIndex % item.cities.length],
        education: "硕士及以上",
        majorRequirement: "车辆工程、机械工程、自动化、计算机等相关专业",
        applyUrl: index % 5 === 0 ? null : `https://example.com/${item.id}/jobs/${jobIndex + 1}`,
        vehicleFitScore: 92 - ((index + jobIndex * 7) % 25),
      })),
    });

    await prisma.resource.createMany({
      data: [
        {
          companyId: company.id,
          title: `${item.name} 技术面试高频问题整理`,
          type: "面经",
          url: index % 7 === 0 ? null : `https://example.com/${item.id}/interview`,
          source: "候选人经验汇总",
          summary: "覆盖项目深挖、专业基础、岗位理解与行为面试准备。",
          credibility: "经验参考",
        },
        {
          companyId: company.id,
          title: `${item.name} 校招投递与测评攻略`,
          type: "投递攻略",
          url: `https://example.com/${item.id}/guide`,
          source: "公开信息整理",
          summary: "整理投递入口、时间节点、测评形式与准备建议。",
          credibility: index % 4 === 0 ? "官方" : "较可信",
        },
      ],
    });

    await prisma.calendarEvent.create({
      data: {
        companyId: company.id,
        recruitmentId: recruitment.id,
        title: `${item.name} ${item.status === "未开始" ? "网申开启" : "网申截止"}`,
        eventType: item.status === "未开始" ? "网申开始" : "网申截止",
        eventDate: new Date(
          item.status === "未开始"
            ? `${startDates[item.status]}T09:00:00Z`
            : `${endDates[item.status]}T18:00:00Z`,
        ),
        status: item.status,
      },
    });
  }

  const user = await prisma.user.create({
    data: { email: "demo@vehicle-campus.local", nickname: "示例用户", role: "ADMIN" },
  });
  await prisma.favorite.create({
    data: { userId: user.id, companyId: companies[0].id },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
