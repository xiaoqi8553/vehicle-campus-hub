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
    actionLabel: string;
    evidenceSummary: string;
  };
};

const companies: CompanySeed[] = [
  { id: "xiaomi-auto", name: "小米汽车", shortName: "小米", type: "新势力", cities: ["北京", "上海"], directions: ["自动驾驶", "智能座舱", "三电", "嵌入式"], officialWebsite: "https://www.mi.com/car/", recruitmentWebsite: "https://hr.xiaomi.com/campus", access: "ok", program: { title: "2027届应届实习计划", sourceUrl: "https://hr.xiaomi.com/campus", actionLabel: "查看小米 2027 届实习说明", evidenceSummary: "小米招聘校园门户明确写明“应届实习”面向 2027 届毕业生；原 /campus/0 深链已返回 404，不再作为项目入口。", note: "官方校园招聘门户包含面向 2027 届毕业生的应届实习说明；具体岗位与截止时间需进入站内实时核对。" } },
  { id: "li-auto", name: "理想汽车", shortName: "理想", type: "新势力", cities: ["北京", "上海", "常州"], directions: ["整车研发", "自动驾驶", "底盘", "测试验证"], officialWebsite: "https://www.lixiang.com/", recruitmentWebsite: "https://www.lixiang.com/employ/campus.html", access: "ok" },
  { id: "nio", name: "蔚来", shortName: "蔚来", type: "新势力", cities: ["上海", "合肥"], directions: ["三电", "车载软件", "整车研发", "智能座舱"], officialWebsite: "https://www.nio.cn/", recruitmentWebsite: "https://campus.nio.com/", access: "ok" },
  { id: "xpeng", name: "小鹏汽车", shortName: "小鹏", type: "新势力", cities: ["广州", "上海"], directions: ["自动驾驶", "智能座舱", "车载软件", "测试验证"], officialWebsite: "https://www.xiaopeng.com/", recruitmentWebsite: "https://xiaopeng.jobs.feishu.cn/campus/", access: "ok", program: { title: "2027届暑期实习项目", sourceUrl: "https://xiaopeng.jobs.feishu.cn/campus/", actionLabel: "查看小鹏 2027 暑期实习", evidenceSummary: "小鹏官方校园招聘页明确列出面向 2027 届毕业生的暑期实习项目。", note: "官方校园招聘页面明确面向 2027 届毕业学生；具体岗位与截止时间以站内实时信息为准。" } },
  { id: "leapmotor", name: "零跑汽车", shortName: "零跑", type: "新势力", cities: ["杭州", "金华"], directions: ["三电", "整车研发", "测试验证", "电池"], officialWebsite: "https://www.leapmotor.com/", recruitmentWebsite: "https://leapmotor1.zhiye.com/campus", access: "ok" },
  { id: "zeekr", name: "极氪", shortName: "极氪", type: "新势力", cities: ["杭州", "宁波"], directions: ["整车研发", "智能座舱", "底盘", "三电"], officialWebsite: "https://www.zeekrgroup.com/", recruitmentWebsite: "https://www.zeekrgroup.com/join-us", access: "ok" },
  { id: "tesla", name: "特斯拉", shortName: "Tesla", type: "外资车企", cities: ["上海", "北京"], directions: ["制造工艺", "电池", "自动驾驶", "测试验证"], officialWebsite: "https://www.tesla.cn/", recruitmentWebsite: "https://www.tesla.cn/careers", access: "limited" },
  { id: "byd", name: "比亚迪", shortName: "比亚迪", type: "传统车企", cities: ["深圳", "西安", "合肥"], directions: ["电池", "电机电控", "整车研发", "热管理"], officialWebsite: "https://www.bydglobal.com/cn/", recruitmentWebsite: "https://job.byd.com/portal/mobile/school-home", access: "ok", program: { title: "2026/2027届实习生招聘", sourceUrl: "https://job.byd.com/portal/mobile/school-home", actionLabel: "打开比亚迪 2027 实习招聘入口", evidenceSummary: "比亚迪官方校园招聘门户明确写明实习生招聘面向 2026 届、2027 届在校生。", note: "官方校园招聘页面包含面向 2027 届在校生的实习招聘说明；正式秋招批次与截止时间仍需等待官方发布。" } },
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

type LinkHealth = "OK" | "BROWSER_ONLY" | "BLOCKED" | "REDIRECTED" | "DEAD" | "MANUAL_REVIEW";

const linkHealth: Record<string, { official: LinkHealth; recruitment: LinkHealth }> = {
  "xiaomi-auto": { official: "BLOCKED", recruitment: "OK" },
  "li-auto": { official: "OK", recruitment: "REDIRECTED" },
  nio: { official: "OK", recruitment: "REDIRECTED" },
  xpeng: { official: "BLOCKED", recruitment: "OK" },
  leapmotor: { official: "REDIRECTED", recruitment: "OK" },
  zeekr: { official: "REDIRECTED", recruitment: "OK" },
  tesla: { official: "BLOCKED", recruitment: "BLOCKED" },
  byd: { official: "REDIRECTED", recruitment: "REDIRECTED" },
  geely: { official: "OK", recruitment: "REDIRECTED" },
  changan: { official: "OK", recruitment: "OK" },
  gac: { official: "REDIRECTED", recruitment: "OK" },
  saic: { official: "OK", recruitment: "REDIRECTED" },
  faw: { official: "MANUAL_REVIEW", recruitment: "MANUAL_REVIEW" },
  dongfeng: { official: "OK", recruitment: "OK" },
  "great-wall": { official: "OK", recruitment: "REDIRECTED" },
  catl: { official: "OK", recruitment: "MANUAL_REVIEW" },
  calb: { official: "OK", recruitment: "OK" },
  bosch: { official: "OK", recruitment: "OK" },
  continental: { official: "BROWSER_ONLY", recruitment: "OK" },
  zf: { official: "OK", recruitment: "OK" },
  denso: { official: "BLOCKED", recruitment: "BLOCKED" },
  horizon: { official: "MANUAL_REVIEW", recruitment: "OK" },
  momenta: { official: "OK", recruitment: "REDIRECTED" },
  "jingwei-hirain": { official: "OK", recruitment: "BLOCKED" },
  hesai: { official: "OK", recruitment: "OK" },
};

const finalUrlByUrl: Record<string, string> = {
  "https://momenta.jobs.feishu.cn/campus/m/": "https://momenta.jobs.feishu.cn/campus/",
  "https://saic-recruit.saicmotor.com/": "https://saic-recruit.saicmotor.com/recruit/pc/#/collegeRecruit",
  "https://campus.geely.com/": "https://campus.geely.com/campus-recruitment/geely/78436/#/",
  "https://www.gac.com.cn/": "https://www.gacgroup.com/en",
  "https://www.zeekrgroup.com/": "https://www.zeekrgroup.com/en",
  "https://www.bydglobal.com/cn/": "https://www.bydglobal.com/cn/index.html",
  "https://job.byd.com/portal/mobile/school-home": "https://job.byd.com/portal/pc/#/school/home",
  "https://www.lixiang.com/employ/campus.html": "https://www.lixiang.com/employ/campus.html?fromJob=1",
  "https://campus.nio.com/": "https://campus.nio.com/#/",
  "https://zhaopin.gwm.cn/": "https://zhaopin.gwm.cn/SU692d3058ea11b01b6c54d0ea/pb/index.html#/",
  "https://www.leapmotor.com/": "https://www.leapmotor.net/",
};

const careerSiteIds = new Set(["tesla", "catl", "bosch", "continental", "zf", "denso"]);
const talentPageIds = new Set(["zeekr", "gac", "hesai"]);
const announcementIds = new Set(["jingwei-hirain"]);

function recruitmentSourceType(item: CompanySeed) {
  if (announcementIds.has(item.id)) return "OFFICIAL_ANNOUNCEMENT";
  if (talentPageIds.has(item.id)) return "TALENT_PAGE";
  if (careerSiteIds.has(item.id)) return "CAREERS_SITE";
  return "CAMPUS_PORTAL";
}

function defaultRecruitmentTitle(item: CompanySeed) {
  if (announcementIds.has(item.id)) return `阅读${item.shortName}官方校招公告`;
  if (talentPageIds.has(item.id)) return `查看${item.shortName}人才招聘页面`;
  if (careerSiteIds.has(item.id)) return `查看${item.shortName}招聘网站`;
  return `打开${item.shortName}校园招聘门户`;
}

function linkEvidenceSummary(item: CompanySeed) {
  const type = recruitmentSourceType(item);
  if (type === "CAMPUS_PORTAL") {
    return "浏览器已核验为校园招聘门户；当前页面未发现可单独证明 2027 届正式校招开放的明确批次与日期。";
  }
  if (type === "OFFICIAL_ANNOUNCEMENT") {
    return "企业官方域名下的校园招聘公告入口；本次自动化访问被安全策略拦截，需人工再次核对内容。";
  }
  return "企业官方招聘或人才页面，可用于查找职位，但不能单独证明 2027 届项目已经开放。";
}

const resources = [
  { id: "autonomous-driving-interview", title: "自动驾驶算法面试准备框架", type: "面经", summary: "按感知、预测、规划控制、仿真评测和项目复盘组织准备项，不包含任何企业题库。", tags: ["自动驾驶", "C++", "测试验证"], content: [{ heading: "先确定岗位子方向", paragraphs: ["自动驾驶岗位的考察差异很大。先区分感知、预测、规划、控制、定位与仿真测试，再按目标岗位收窄准备范围。"], checklist: ["能用两分钟解释目标岗位解决的问题", "能说清输入、输出、评价指标和失败模式"] }, { heading: "算法与工程基础", paragraphs: ["感知方向重点复习坐标系、标定、检测与跟踪；规划控制方向重点复习搜索、优化、车辆模型和闭环稳定性。"], checklist: ["准备一段可手写或口述的核心算法", "解释时间复杂度与工程取舍"] }, { heading: "项目复盘", paragraphs: ["项目回答应包含问题定义、数据或场景、个人贡献、指标变化、失败案例和下一步改进。"], checklist: ["避免只描述团队成果", "准备一次错误定位与修复过程"] }] },
  { id: "embedded-cpp-interview", title: "车载嵌入式 C/C++ 面试检查表", type: "面经", summary: "覆盖内存、并发、通信协议、RTOS、Linux 与调试方法，适合车载软件方向自查。", tags: ["嵌入式", "C++", "智能座舱"], content: [{ heading: "语言与内存", paragraphs: ["从对象生命周期、栈与堆、指针与引用、RAII、虚函数和常见未定义行为开始复习。"], checklist: ["能解释一次内存泄漏定位", "能比较深拷贝与移动语义"] }, { heading: "实时与并发", paragraphs: ["准备任务调度、中断、互斥、条件变量、优先级反转以及实时系统中的延迟来源。"], checklist: ["能画出一次生产者消费者时序", "能解释如何避免死锁"] }, { heading: "车载通信与调试", paragraphs: ["CAN、LIN、车载以太网与诊断协议需要结合报文、故障码和实际调试工具说明。"], checklist: ["准备一例总线异常定位", "说明日志、示波器或抓包工具的使用"] }] },
  { id: "chassis-dynamics", title: "底盘与车辆动力学复习路径", type: "笔试", summary: "围绕悬架、制动、转向、整车动力学、仿真和试验验证梳理知识结构。", tags: ["底盘", "整车研发", "测试验证"], content: [{ heading: "建立整车坐标与受力图", paragraphs: ["先统一纵向、横向、垂向和横摆等坐标定义，再从轮胎力与车身受力建立分析路径。"], checklist: ["能画单轨模型", "能解释质心位置的影响"] }, { heading: "底盘系统", paragraphs: ["按悬架、转向、制动和轮胎四部分复习结构、关键参数、控制目标与典型故障。"], checklist: ["比较不足转向与过度转向", "说明制动稳定性的关键因素"] }, { heading: "仿真与试验", paragraphs: ["把模型、输入工况、评价指标和试验相关性放在同一条验证链路中。"], checklist: ["准备一个仿真模型校准案例", "说明误差来源与边界"] }] },
  { id: "battery-thermal", title: "三电、电池与热管理知识清单", type: "笔试", summary: "梳理电池系统、电机电控、BMS、热管理与新能源汽车基础概念。", tags: ["三电", "电池", "热管理"], content: [{ heading: "电池系统", paragraphs: ["复习电芯体系、串并联、SOC/SOH、均衡、热失控和高压安全，注意区分估算算法与系统工程。"], checklist: ["解释 SOC 估算误差来源", "说明热失控传播的抑制思路"] }, { heading: "电机与电控", paragraphs: ["理解永磁同步电机基本结构、转矩产生、逆变器和常见控制框架。"], checklist: ["比较不同工况下的效率关注点", "说明弱磁控制的目的"] }, { heading: "热管理", paragraphs: ["从热源、热阻、冷却回路、控制策略和极端工况五个角度组织答案。"], checklist: ["画出典型冷却回路", "说明低温与快充的矛盾"] }] },
  { id: "assessment", title: "在线测评与群面准备方法", type: "测评", summary: "总结行测、性格测评、无领导小组讨论和时间分配方法，不代表企业官方流程。", tags: ["测试验证", "群面", "HR面"], content: [{ heading: "在线测评", paragraphs: ["先确认题型、时限和设备要求。练习重点是稳定节奏，不是记忆所谓企业题库。"], checklist: ["提前测试浏览器与网络", "为资料分析和图表题设定时间上限"] }, { heading: "群面", paragraphs: ["贡献可以是定义问题、建立标准、推进收敛或总结表达，不必争抢主持角色。"], checklist: ["先记录共同目标", "用证据推动而非重复观点"] }, { heading: "HR 面", paragraphs: ["把动机、地点、岗位选择和项目经历保持一致，避免不同轮次出现互相冲突的答案。"], checklist: ["准备岗位选择理由", "准备一次真实挫折与复盘"] }] },
  { id: "resume-project", title: "车辆方向简历项目表达指南", type: "简历", summary: "将课程设计、竞赛、仿真、控制、嵌入式和实习经历转化为可核验的岗位语言。", tags: ["整车研发", "自动驾驶", "嵌入式"], content: [{ heading: "先对齐岗位", paragraphs: ["每段经历只保留与目标岗位有关的问题、方法、工具和结果，删除不能支撑岗位能力的背景铺陈。"], checklist: ["标题直接说明项目对象", "首句写清个人责任"] }, { heading: "写出可核验结果", paragraphs: ["结果可以是性能指标、测试覆盖、故障定位时间、资源占用或交付节点，不应编造百分比。"], checklist: ["每个数字都能解释来源", "没有数字时说明验收标准"] }, { heading: "准备追问", paragraphs: ["简历中的每个技术名词都可能被追问。准备设计选择、替代方案、失败过程和复现实验。"], checklist: ["能画系统架构", "能解释最难的一次取舍"] }] },
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
  await prisma.companyLink.deleteMany();
  await prisma.company.deleteMany();

  for (const item of companies) {
    const health = linkHealth[item.id];
    const sourceType = recruitmentSourceType(item);
    const recruitmentIsUsable = ["OK", "BROWSER_ONLY", "REDIRECTED"].includes(health.recruitment);
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
        verifiedAt: VERIFIED_AT,
        lastVerifiedAt: VERIFIED_AT,
        dateConfidence: "UNKNOWN",
        changeSummary: item.program ? "重新核验 2027 届项目证据与入口状态" : "完成招聘入口浏览器核验",
        cities: stringifyStringList(item.cities),
        tags: stringifyStringList(item.directions),
        vehicleDirections: stringifyStringList(item.directions),
        fitDirections: stringifyStringList(item.directions),
        status,
        dataStatus: health.recruitment === "OK"
          ? "入口可用"
          : health.recruitment === "REDIRECTED"
            ? "入口已重定向"
            : health.recruitment === "BLOCKED"
              ? "反爬限制"
              : "待人工确认",
        lastUpdatedAt: VERIFIED_AT,
      },
    });

    await prisma.companyLink.createMany({
      data: [
        {
          id: `${item.id}-official`,
          companyId: item.id,
          title: `访问${item.shortName}企业官网`,
          url: item.officialWebsite,
          finalUrl: finalUrlByUrl[item.officialWebsite] ?? item.officialWebsite,
          sourceType: "COMPANY_WEBSITE",
          targetCohort: "不限",
          verifiedAt: VERIFIED_AT,
          healthStatus: health.official,
          evidenceSummary: "企业官方域名，仅用于了解公司业务，不能证明任何校招批次开放。",
          isPrimary: false,
          httpStatus: health.official === "BLOCKED" ? 403 : health.official === "MANUAL_REVIEW" ? null : 200,
        },
        {
          id: `${item.id}-recruitment`,
          companyId: item.id,
          title: item.program?.actionLabel ?? defaultRecruitmentTitle(item),
          url: item.recruitmentWebsite,
          finalUrl: finalUrlByUrl[item.recruitmentWebsite] ?? item.recruitmentWebsite,
          sourceType,
          targetCohort: item.program ? (item.id === "byd" ? "2026/2027" : "2027") : "未明确",
          verifiedAt: VERIFIED_AT,
          healthStatus: health.recruitment,
          evidenceSummary: item.program?.evidenceSummary ?? linkEvidenceSummary(item),
          isPrimary: recruitmentIsUsable,
          httpStatus: health.recruitment === "BLOCKED" ? 403 : health.recruitment === "MANUAL_REVIEW" ? null : 200,
        },
      ],
    });

    if (item.id === "xiaomi-auto") {
      await prisma.companyLink.create({
        data: {
          id: "xiaomi-auto-dead-project",
          companyId: item.id,
          title: "小米历史项目深链（已失效）",
          url: "https://hr.xiaomi.com/campus/0",
          finalUrl: "https://hr.xiaomi.com/campus/0",
          sourceType: "COHORT_PROJECT",
          targetCohort: "2027",
          verifiedAt: VERIFIED_AT,
          healthStatus: "DEAD",
          evidenceSummary: "2026-06-11 使用真实浏览器访问返回 404，因此不再作为投递入口或 2027 届开放证据。",
          isPrimary: false,
          httpStatus: 404,
        },
      });
    }

    if (item.program) {
      await prisma.recruitment.create({
        data: {
          companyId: item.id,
          year: 2027,
          targetYear: 2027,
          season: "实习",
          batch: "实习",
          title: item.program.title,
          status: "2027实习开放",
          startDate: null,
          endDate: null,
          applyUrl: item.program.sourceUrl,
          process: "进入官方校园招聘页面，核对当前岗位、毕业时间要求与站内申请流程。",
          note: item.program.note,
          notes: item.program.note,
          sourceUrl: item.program.sourceUrl,
          sourceType: "OFFICIAL",
          sourceLinkId: `${item.id}-recruitment`,
          verifiedAt: VERIFIED_AT,
          dateConfidence: "UNKNOWN",
          changeSummary: "重新核验项目届次与链接健康状态",
          credibility: "官方",
        },
      });
    }
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
      content: JSON.stringify(item.content),
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
