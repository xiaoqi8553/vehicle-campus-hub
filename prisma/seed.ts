import { PrismaClient } from "@prisma/client";
import { stringifyStringList } from "../lib/domain";

const prisma = new PrismaClient();
const VERIFIED_AT = new Date("2026-06-11T00:00:00.000Z");

type CompanySeed = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  cities: string[];
  directions: string[];
  officialWebsite: string;
  recruitmentWebsite: string;
  access: "ok" | "limited" | "review";
  program?: {
    title: string;
    sourceUrl: string;
    note: string;
  };
};

const companies: CompanySeed[] = [
  { id: "xiaomi-auto", name: "小米汽车", shortName: "小米", type: "新势力", cities: ["北京", "上海"], directions: ["自动驾驶", "智能座舱", "三电", "嵌入式"], officialWebsite: "https://www.mi.com/car/", recruitmentWebsite: "https://hr.xiaomi.com/campus", access: "ok", program: { title: "2027届实习项目", sourceUrl: "https://hr.xiaomi.com/campus/0", note: "官方页面明确面向 2027 年 7 月至 2028 年 6 月毕业学生；具体岗位与截止时间以站内实时信息为准。" } },
  { id: "li-auto", name: "理想汽车", shortName: "理想", type: "新势力", cities: ["北京", "上海", "常州"], directions: ["整车研发", "自动驾驶", "底盘", "测试验证"], officialWebsite: "https://www.lixiang.com/", recruitmentWebsite: "https://www.lixiang.com/employ/campus.html", access: "ok" },
  { id: "nio", name: "蔚来", shortName: "蔚来", type: "新势力", cities: ["上海", "合肥"], directions: ["三电", "车载软件", "整车研发", "智能座舱"], officialWebsite: "https://www.nio.cn/", recruitmentWebsite: "https://campus.nio.com/", access: "ok" },
  { id: "xpeng", name: "小鹏汽车", shortName: "小鹏", type: "新势力", cities: ["广州", "上海"], directions: ["自动驾驶", "智能座舱", "车载软件", "测试验证"], officialWebsite: "https://www.xiaopeng.com/", recruitmentWebsite: "https://xiaopeng.jobs.feishu.cn/campus/", access: "ok", program: { title: "2027届及以后实习项目", sourceUrl: "https://xiaopeng.jobs.feishu.cn/campus/", note: "官方校招页面明确面向 2027 届及以后毕业学生；具体岗位与截止时间以站内实时信息为准。" } },
  { id: "leapmotor", name: "零跑汽车", shortName: "零跑", type: "新势力", cities: ["杭州", "金华"], directions: ["三电", "整车研发", "测试验证", "电池"], officialWebsite: "https://www.leapmotor.com/", recruitmentWebsite: "https://leapmotor1.zhiye.com/campus", access: "ok" },
  { id: "zeekr", name: "极氪", shortName: "极氪", type: "新势力", cities: ["杭州", "宁波"], directions: ["整车研发", "智能座舱", "底盘", "三电"], officialWebsite: "https://www.zeekrgroup.com/", recruitmentWebsite: "https://www.zeekrgroup.com/join-us", access: "ok" },
  { id: "tesla", name: "特斯拉", shortName: "Tesla", type: "外资车企", cities: ["上海", "北京"], directions: ["制造工艺", "电池", "自动驾驶", "测试验证"], officialWebsite: "https://www.tesla.cn/", recruitmentWebsite: "https://www.tesla.cn/careers", access: "limited" },
  { id: "byd", name: "比亚迪", shortName: "比亚迪", type: "传统车企", cities: ["深圳", "西安", "合肥"], directions: ["电池", "电机电控", "整车研发", "热管理"], officialWebsite: "https://www.bydglobal.com/cn/", recruitmentWebsite: "https://job.byd.com/portal/mobile/school-home", access: "ok", program: { title: "2027届实习项目", sourceUrl: "https://job.byd.com/portal/mobile/school-home", note: "官方校园招聘页面包含 2027 届实习项目说明；正式校招批次与截止时间仍需等待官方发布。" } },
  { id: "geely", name: "吉利汽车", shortName: "吉利", type: "传统车企", cities: ["杭州", "宁波"], directions: ["整车研发", "底盘", "智能座舱", "车载软件"], officialWebsite: "https://www.geely.com/", recruitmentWebsite: "https://campus.geely.com/", access: "ok" },
  { id: "changan", name: "长安汽车", shortName: "长安", type: "传统车企", cities: ["重庆", "上海"], directions: ["整车研发", "三电", "CAE仿真", "测试验证"], officialWebsite: "https://www.changan.com.cn/", recruitmentWebsite: "https://changan.zhiye.com/Campus", access: "ok" },
  { id: "gac", name: "广汽集团", shortName: "广汽", type: "传统车企", cities: ["广州"], directions: ["整车研发", "车身", "车载软件", "测试验证"], officialWebsite: "https://www.gac.com.cn/", recruitmentWebsite: "https://www.gacgroup.com/cn/talent", access: "ok" },
  { id: "saic", name: "上汽集团", shortName: "上汽", type: "传统车企", cities: ["上海"], directions: ["整车研发", "车载软件", "测试验证", "智能座舱"], officialWebsite: "https://www.saicmotor.com/", recruitmentWebsite: "https://saic-recruit.saicmotor.com/", access: "review" },
  { id: "faw", name: "中国一汽", shortName: "一汽", type: "传统车企", cities: ["长春", "南京"], directions: ["整车研发", "底盘", "制造工艺", "测试验证"], officialWebsite: "https://www.faw.com.cn/", recruitmentWebsite: "https://faw-zhaopin.hotjob.cn/", access: "ok" },
  { id: "dongfeng", name: "东风汽车", shortName: "东风", type: "传统车企", cities: ["武汉"], directions: ["动力总成", "三电", "测试验证", "整车研发"], officialWebsite: "https://www.dfmc.com.cn/", recruitmentWebsite: "https://dfmc.hotjob.cn/", access: "ok" },
  { id: "great-wall", name: "长城汽车", shortName: "长城", type: "传统车企", cities: ["保定", "上海"], directions: ["底盘", "动力总成", "自动驾驶", "整车研发"], officialWebsite: "https://www.gwm.com.cn/", recruitmentWebsite: "https://zhaopin.gwm.cn/", access: "ok" },
  { id: "catl", name: "宁德时代", shortName: "宁德时代", type: "电池三电", cities: ["宁德", "上海", "溧阳"], directions: ["电池", "热管理", "测试验证", "电机电控"], officialWebsite: "https://www.catl.com/", recruitmentWebsite: "https://career.catl.com/", access: "limited" },
  { id: "calb", name: "中创新航", shortName: "中创新航", type: "电池三电", cities: ["常州", "成都"], directions: ["电池", "制造工艺", "热管理", "测试验证"], officialWebsite: "https://www.calb-tech.com/", recruitmentWebsite: "https://calbjs.zhiye.com/campus", access: "ok" },
  { id: "bosch", name: "博世", shortName: "博世", type: "零部件", cities: ["苏州", "上海", "无锡"], directions: ["底盘", "电机电控", "自动驾驶", "嵌入式"], officialWebsite: "https://www.bosch.com.cn/", recruitmentWebsite: "https://www.bosch.com.cn/careers/", access: "ok" },
  { id: "continental", name: "大陆集团", shortName: "大陆", type: "零部件", cities: ["上海", "芜湖"], directions: ["智能座舱", "底盘", "嵌入式", "测试验证"], officialWebsite: "https://www.continental.com/zh-cn/", recruitmentWebsite: "https://www.continental.com/en/career/", access: "ok" },
  { id: "zf", name: "采埃孚", shortName: "ZF", type: "零部件", cities: ["上海", "杭州"], directions: ["动力总成", "底盘", "测试验证", "制造工艺"], officialWebsite: "https://www.zf.com/china/zh/home/home.html", recruitmentWebsite: "https://jobs.zf.com/?locale=zh_CN", access: "ok" },
  { id: "denso", name: "电装", shortName: "电装", type: "零部件", cities: ["上海", "广州"], directions: ["热管理", "电机电控", "嵌入式", "测试验证"], officialWebsite: "https://www.denso.com/cn/zh/", recruitmentWebsite: "https://www.denso.com/cn/zh/careers/", access: "limited" },
  { id: "horizon", name: "地平线", shortName: "地平线", type: "智能化供应商", cities: ["北京", "上海"], directions: ["自动驾驶", "嵌入式", "车载软件", "测试验证"], officialWebsite: "https://www.horizon.cc/", recruitmentWebsite: "https://horizon-campus.hotjob.cn/", access: "ok" },
  { id: "momenta", name: "Momenta", shortName: "Momenta", type: "自动驾驶", cities: ["苏州", "上海", "北京"], directions: ["自动驾驶", "测试验证", "车载软件", "C++"], officialWebsite: "https://www.momenta.cn/", recruitmentWebsite: "https://momenta.jobs.feishu.cn/campus/m/", access: "ok" },
  { id: "jingwei-hirain", name: "经纬恒润", shortName: "经纬恒润", type: "智能化供应商", cities: ["北京", "天津", "上海"], directions: ["嵌入式", "车载软件", "测试验证", "自动驾驶"], officialWebsite: "https://www.hirain.com/", recruitmentWebsite: "https://www.hirain.com/news/%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-16", access: "limited" },
  { id: "hesai", name: "禾赛科技", shortName: "禾赛", type: "智能化供应商", cities: ["上海"], directions: ["自动驾驶", "嵌入式", "测试验证", "制造工艺"], officialWebsite: "https://www.hesaitech.com/cn/", recruitmentWebsite: "https://www.hesaitech.com/cn/careers", access: "ok" },
];

const resources = [
  { id: "autonomous-driving-interview", title: "自动驾驶算法面试准备框架", type: "面经", summary: "按感知、预测、规划控制、仿真评测和项目复盘组织准备项，不包含任何企业题库。", tags: ["自动驾驶", "C++", "测试验证"] },
  { id: "embedded-cpp-interview", title: "车载嵌入式 C/C++ 面试检查表", type: "面经", summary: "覆盖内存、并发、通信协议、RTOS、Linux 与调试方法，适合车载软件方向自查。", tags: ["嵌入式", "C++", "智能座舱"] },
  { id: "chassis-dynamics", title: "底盘与车辆动力学复习路径", type: "笔试", summary: "围绕悬架、制动、转向、整车动力学、仿真和试验验证梳理知识结构。", tags: ["底盘", "整车研发", "测试验证"] },
  { id: "battery-thermal", title: "三电、电池与热管理知识清单", type: "笔试", summary: "梳理电池系统、电机电控、BMS、热管理与新能源汽车基础概念。", tags: ["三电", "电池", "热管理"] },
  { id: "assessment", title: "在线测评与群面准备方法", type: "测评", summary: "总结行测、性格测评、无领导小组讨论和时间分配方法，不代表企业官方流程。", tags: ["测试验证", "群面", "HR面"] },
  { id: "resume-project", title: "车辆方向简历项目表达指南", type: "简历", summary: "将课程设计、竞赛、仿真、控制、嵌入式和实习经历转化为可核验的岗位语言。", tags: ["整车研发", "自动驾驶", "嵌入式"] },
];

function description(item: CompanySeed) {
  return `${item.name}的公开业务与车辆技术方向参考。平台仅跟踪官方招聘入口，不推断未发布的 2027 届批次、岗位或日期。`;
}

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruitment.deleteMany();
  await prisma.company.deleteMany();

  for (const item of companies) {
    const verifiedAt = item.access === "ok" ? VERIFIED_AT : null;
    const status = item.program ? "2027实习开放" : "待官方发布";
    await prisma.company.create({
      data: {
        id: item.id,
        slug: item.id,
        name: item.name,
        shortName: item.shortName,
        type: item.type,
        category: item.type,
        description: description(item),
        officialWebsite: item.officialWebsite,
        recruitmentWebsite: item.recruitmentWebsite,
        campusRecruitmentWebsite: item.program ? item.recruitmentWebsite : null,
        campusUrl: item.program ? item.recruitmentWebsite : null,
        sourceUrl: item.recruitmentWebsite,
        sourceType: "OFFICIAL",
        verifiedAt,
        lastVerifiedAt: verifiedAt,
        dateConfidence: "UNKNOWN",
        changeSummary: item.program ? "确认 2027 届实习项目入口" : null,
        cities: stringifyStringList(item.cities),
        tags: stringifyStringList(item.directions),
        vehicleDirections: stringifyStringList(item.directions),
        fitDirections: stringifyStringList(item.directions),
        status,
        dataStatus: item.access === "ok" ? "入口可用" : item.access === "limited" ? "访问受限" : "待复核",
        lastUpdatedAt: VERIFIED_AT,
        recruitments: item.program ? {
          create: {
            year: 2027,
            targetYear: 2027,
            season: "实习",
            batch: "实习",
            title: item.program.title,
            status: "2027实习开放",
            startDate: null,
            endDate: null,
            applyUrl: item.program.sourceUrl,
            process: "请进入官方招聘页面查看当前开放岗位和站内流程。",
            note: item.program.note,
            notes: item.program.note,
            sourceUrl: item.program.sourceUrl,
            sourceType: "OFFICIAL",
            verifiedAt: VERIFIED_AT,
            dateConfidence: "UNKNOWN",
            changeSummary: "确认 2027 届实习项目入口",
            credibility: "官方",
          },
        } : undefined,
      },
    });
  }

  await prisma.resource.createMany({
    data: resources.map((item) => ({
      ...item,
      companyId: null,
      targetYear: 2027,
      sourceYear: 2026,
      url: null,
      sourceUrl: null,
      source: "平台原创方法论",
      sourceType: "PUBLIC",
      verifiedAt: VERIFIED_AT,
      dateConfidence: "UNKNOWN",
      changeSummary: "去除重复企业模板，保留一次公共方法资料",
      credibility: "平台整理",
      tags: stringifyStringList(item.tags),
      lastVerifiedAt: VERIFIED_AT,
    })),
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
