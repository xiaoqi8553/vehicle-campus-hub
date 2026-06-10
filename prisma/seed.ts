import { PrismaClient } from "@prisma/client";
import { stringifyStringList } from "../lib/domain";

const prisma = new PrismaClient();

type SeedCompany = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  cities: string[];
  tags: string[];
  vehicleDirections: string[];
  status: string;
  dataStatus: string;
  officialWebsite: string | null;
  campusRecruitmentWebsite: string | null;
  description: string;
  lastVerifiedAt: string | null;
};

// TODO: 对 dataStatus 为“缺链接/待核实”的企业逐条补充 2027 届官方投递页、来源页和核验记录。
const companies: SeedCompany[] = [
  {
    id: "xiaomi-auto",
    name: "小米汽车",
    shortName: "小米",
    type: "新势力",
    cities: ["北京", "上海"],
    tags: ["智能电动", "自动驾驶", "智能座舱"],
    vehicleDirections: ["自动驾驶", "智能座舱", "三电", "嵌入式"],
    status: "已开启",
    dataStatus: "已核验",
    officialWebsite: "https://www.mi.com/car/",
    campusRecruitmentWebsite: "https://hr.xiaomi.com/",
    description: "小米汽车聚焦智能电动汽车、智能座舱、整车软件和自动驾驶研发，适合关注软硬件融合与量产工程的车辆相关专业学生重点跟踪。",
    lastVerifiedAt: "2026-06-10",
  },
  {
    id: "li-auto",
    name: "理想汽车",
    shortName: "理想",
    type: "新势力",
    cities: ["北京", "上海", "常州"],
    tags: ["增程", "智能驾驶", "整车研发"],
    vehicleDirections: ["整车研发", "自动驾驶", "底盘", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.lixiang.com/",
    campusRecruitmentWebsite: null,
    description: "理想汽车围绕家庭智能电动车、增程系统、智能驾驶和整车平台开展研发，适合整车、控制、软件和测试验证方向同学关注。",
    lastVerifiedAt: null,
  },
  {
    id: "nio",
    name: "蔚来",
    shortName: "蔚来",
    type: "新势力",
    cities: ["上海", "合肥"],
    tags: ["智能电动", "换电", "车载软件"],
    vehicleDirections: ["三电", "车载软件", "整车研发", "智能座舱"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.nio.cn/",
    campusRecruitmentWebsite: null,
    description: "蔚来覆盖智能电动汽车、能源补能、车载系统和用户服务体系，适合关注新能源整车、软件平台和服务生态的同学。",
    lastVerifiedAt: null,
  },
  {
    id: "xpeng",
    name: "小鹏汽车",
    shortName: "小鹏",
    type: "新势力",
    cities: ["广州", "上海"],
    tags: ["自动驾驶", "智能座舱"],
    vehicleDirections: ["自动驾驶", "智能座舱", "车载软件", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.xiaopeng.com/",
    campusRecruitmentWebsite: null,
    description: "小鹏汽车重点布局智能驾驶、车载系统和电动平台，适合自动驾驶算法、嵌入式软件和智能座舱方向同学跟踪。",
    lastVerifiedAt: null,
  },
  {
    id: "leapmotor",
    name: "零跑汽车",
    shortName: "零跑",
    type: "新势力",
    cities: ["杭州", "金华"],
    tags: ["全域自研", "三电"],
    vehicleDirections: ["三电", "整车研发", "测试验证", "电池"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.leapmotor.com/",
    campusRecruitmentWebsite: null,
    description: "零跑汽车强调电驱、电池、智能座舱等核心系统自研，适合希望参与新能源整车工程闭环的同学关注。",
    lastVerifiedAt: null,
  },
  {
    id: "zeekr",
    name: "极氪",
    shortName: "极氪",
    type: "新势力",
    cities: ["杭州", "宁波"],
    tags: ["纯电", "智能座舱"],
    vehicleDirections: ["整车研发", "智能座舱", "底盘", "三电"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.zeekrlife.com/",
    campusRecruitmentWebsite: null,
    description: "极氪面向高端智能纯电汽车，岗位方向通常覆盖整车平台、底盘、电驱、电池和座舱体验等模块。",
    lastVerifiedAt: null,
  },
  {
    id: "tesla",
    name: "特斯拉",
    shortName: "Tesla",
    type: "外资车企",
    cities: ["上海", "北京"],
    tags: ["智能制造", "电池", "自动驾驶"],
    vehicleDirections: ["制造工艺", "电池", "自动驾驶", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.tesla.cn/",
    campusRecruitmentWebsite: null,
    description: "特斯拉在中国覆盖制造、质量、供应链和车辆工程相关岗位，适合关注量产工程、电池和自动化制造方向的同学。",
    lastVerifiedAt: null,
  },
  {
    id: "byd",
    name: "比亚迪",
    shortName: "比亚迪",
    type: "传统车企",
    cities: ["深圳", "西安", "合肥"],
    tags: ["电池", "电机电控", "整车研发"],
    vehicleDirections: ["电池", "电机电控", "整车研发", "热管理"],
    status: "已开启",
    dataStatus: "待核实",
    officialWebsite: "https://www.bydglobal.com/cn/",
    campusRecruitmentWebsite: "https://job.byd.com/",
    description: "比亚迪覆盖整车、电池、电驱、电控、半导体与制造体系，是车辆、机械、自动化和新能源方向学生的重要目标企业。",
    lastVerifiedAt: "2026-06-10",
  },
  {
    id: "geely",
    name: "吉利汽车",
    shortName: "吉利",
    type: "传统车企",
    cities: ["杭州", "宁波"],
    tags: ["整车研发", "智能化"],
    vehicleDirections: ["整车研发", "底盘", "智能座舱", "车载软件"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.geely.com/",
    campusRecruitmentWebsite: null,
    description: "吉利汽车覆盖多个品牌与研发体系，适合关注整车开发、底盘、智能化和新能源平台的同学持续跟踪。",
    lastVerifiedAt: null,
  },
  {
    id: "changan",
    name: "长安汽车",
    shortName: "长安",
    type: "传统车企",
    cities: ["重庆", "上海"],
    tags: ["整车研发", "新能源"],
    vehicleDirections: ["整车研发", "三电", "CAE仿真", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.changan.com.cn/",
    campusRecruitmentWebsite: null,
    description: "长安汽车在整车研发、新能源、智能化和试验验证方向具备较完整平台，适合车辆工程与控制方向同学关注。",
    lastVerifiedAt: null,
  },
  {
    id: "gac",
    name: "广汽集团",
    shortName: "广汽",
    type: "传统车企",
    cities: ["广州"],
    tags: ["新能源", "智能网联"],
    vehicleDirections: ["整车研发", "车身", "车载软件", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.gac.com.cn/",
    campusRecruitmentWebsite: null,
    description: "广汽集团覆盖整车研发、智能网联、新能源和制造体系，适合关注华南整车产业链机会的同学。",
    lastVerifiedAt: null,
  },
  {
    id: "saic",
    name: "上汽集团",
    shortName: "上汽",
    type: "传统车企",
    cities: ["上海"],
    tags: ["整车研发", "软件汽车"],
    vehicleDirections: ["整车研发", "车载软件", "测试验证", "智能座舱"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.saicmotor.com/",
    campusRecruitmentWebsite: null,
    description: "上汽集团在整车、软件、智能网联和新能源领域均有布局，适合希望在上海汽车产业链发展的同学。",
    lastVerifiedAt: null,
  },
  {
    id: "faw",
    name: "一汽集团",
    shortName: "一汽",
    type: "传统车企",
    cities: ["长春", "南京"],
    tags: ["整车研发", "智能制造"],
    vehicleDirections: ["整车研发", "底盘", "制造工艺", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.faw.com.cn/",
    campusRecruitmentWebsite: null,
    description: "一汽集团覆盖自主品牌、合资体系和研发制造平台，适合关注传统整车研发、试验和制造工程的同学。",
    lastVerifiedAt: null,
  },
  {
    id: "dongfeng",
    name: "东风汽车",
    shortName: "东风",
    type: "传统车企",
    cities: ["武汉"],
    tags: ["整车研发", "新能源"],
    vehicleDirections: ["动力总成", "三电", "测试验证", "整车研发"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.dfmc.com.cn/",
    campusRecruitmentWebsite: null,
    description: "东风汽车在乘用车、商用车、新能源和动力系统方向均有业务，适合希望进入中部整车产业链的同学。",
    lastVerifiedAt: null,
  },
  {
    id: "great-wall",
    name: "长城汽车",
    shortName: "长城",
    type: "传统车企",
    cities: ["保定", "上海"],
    tags: ["越野", "智能化"],
    vehicleDirections: ["底盘", "动力总成", "自动驾驶", "整车研发"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.gwm.com.cn/",
    campusRecruitmentWebsite: null,
    description: "长城汽车覆盖 SUV、越野、新能源和智能化平台，适合底盘、动力、整车试验和软件方向同学关注。",
    lastVerifiedAt: null,
  },
  {
    id: "catl",
    name: "宁德时代",
    shortName: "宁德时代",
    type: "电池三电",
    cities: ["宁德", "上海", "溧阳"],
    tags: ["电池", "储能", "热管理"],
    vehicleDirections: ["电池", "热管理", "测试验证", "电机电控"],
    status: "已开启",
    dataStatus: "待核实",
    officialWebsite: "https://www.catl.com/",
    campusRecruitmentWebsite: "https://career.catl.com/",
    description: "宁德时代是动力电池与储能方向核心企业，适合电池材料、电池系统、热管理、测试验证和智能制造方向学生。",
    lastVerifiedAt: "2026-06-10",
  },
  {
    id: "calb",
    name: "中创新航",
    shortName: "中创新航",
    type: "电池三电",
    cities: ["常州", "成都"],
    tags: ["动力电池", "材料"],
    vehicleDirections: ["电池", "制造工艺", "热管理", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.calb-tech.com/",
    campusRecruitmentWebsite: null,
    description: "中创新航聚焦动力电池和储能系统，适合电池材料、结构设计、热管理和制造质量方向同学关注。",
    lastVerifiedAt: null,
  },
  {
    id: "bosch",
    name: "博世",
    shortName: "博世",
    type: "零部件",
    cities: ["苏州", "上海", "无锡"],
    tags: ["底盘", "电控", "自动驾驶"],
    vehicleDirections: ["底盘", "电机电控", "自动驾驶", "嵌入式"],
    status: "已开启",
    dataStatus: "待核实",
    officialWebsite: "https://www.bosch.com.cn/",
    campusRecruitmentWebsite: "https://www.bosch.com.cn/careers/",
    description: "博世在底盘控制、动力系统、智能驾驶和嵌入式电控方向布局广，适合车辆、自动化、电子和软件方向同学。",
    lastVerifiedAt: "2026-06-10",
  },
  {
    id: "continental",
    name: "大陆集团",
    shortName: "大陆",
    type: "零部件",
    cities: ["上海", "芜湖"],
    tags: ["智能座舱", "底盘", "车载软件"],
    vehicleDirections: ["智能座舱", "底盘", "嵌入式", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.continental.com/zh-cn/",
    campusRecruitmentWebsite: null,
    description: "大陆集团覆盖轮胎、底盘、安全、电子和软件业务，适合零部件系统、嵌入式和测试验证方向学生。",
    lastVerifiedAt: null,
  },
  {
    id: "zf",
    name: "采埃孚",
    shortName: "ZF",
    type: "零部件",
    cities: ["上海", "杭州"],
    tags: ["传动", "底盘", "安全"],
    vehicleDirections: ["动力总成", "底盘", "测试验证", "制造工艺"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.zf.com/china/zh/home/home.html",
    campusRecruitmentWebsite: null,
    description: "采埃孚聚焦底盘、传动、安全和电驱系统，适合底盘控制、动力传动和系统测试方向同学关注。",
    lastVerifiedAt: null,
  },
  {
    id: "denso",
    name: "电装",
    shortName: "电装",
    type: "零部件",
    cities: ["上海", "广州"],
    tags: ["热管理", "电装系统"],
    vehicleDirections: ["热管理", "电机电控", "嵌入式", "测试验证"],
    status: "已开启",
    dataStatus: "已核验",
    officialWebsite: "https://www.denso.com/cn/zh/",
    campusRecruitmentWebsite: "https://www.denso.com/cn/zh/careers/",
    description: "电装在热管理、电装系统、动力控制和车载电子方向具备优势，适合热管理、嵌入式和电子控制方向同学。",
    lastVerifiedAt: "2026-06-10",
  },
  {
    id: "horizon",
    name: "地平线",
    shortName: "地平线",
    type: "智能化供应商",
    cities: ["北京", "上海"],
    tags: ["自动驾驶", "车规芯片", "嵌入式"],
    vehicleDirections: ["自动驾驶", "嵌入式", "车载软件", "测试验证"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.horizon.cc/",
    campusRecruitmentWebsite: null,
    description: "地平线聚焦车载计算芯片和智能驾驶方案，适合自动驾驶算法、嵌入式软件、工具链和系统测试方向同学。",
    lastVerifiedAt: null,
  },
  {
    id: "momenta",
    name: "Momenta",
    shortName: "Momenta",
    type: "自动驾驶",
    cities: ["苏州", "上海", "北京"],
    tags: ["自动驾驶", "数据闭环"],
    vehicleDirections: ["自动驾驶", "测试验证", "车载软件", "C++"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.momenta.cn/",
    campusRecruitmentWebsite: null,
    description: "Momenta 聚焦自动驾驶算法、数据闭环和量产方案，适合感知、规划控制、C++ 工程和仿真测试方向同学。",
    lastVerifiedAt: null,
  },
  {
    id: "jingwei-hirain",
    name: "经纬恒润",
    shortName: "经纬恒润",
    type: "智能化供应商",
    cities: ["北京", "天津", "上海"],
    tags: ["嵌入式", "车载软件", "智能驾驶"],
    vehicleDirections: ["嵌入式", "车载软件", "测试验证", "自动驾驶"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.hirain.com/",
    campusRecruitmentWebsite: null,
    description: "经纬恒润覆盖智能驾驶、车载电子、嵌入式软件和测试工具链，是控制、自动化和软件方向学生的重点供应商标的。",
    lastVerifiedAt: null,
  },
  {
    id: "hesai",
    name: "禾赛科技",
    shortName: "禾赛",
    type: "智能化供应商",
    cities: ["上海"],
    tags: ["激光雷达", "自动驾驶", "光机电"],
    vehicleDirections: ["自动驾驶", "嵌入式", "测试验证", "制造工艺"],
    status: "待确认",
    dataStatus: "缺链接",
    officialWebsite: "https://www.hesaitech.com/",
    campusRecruitmentWebsite: null,
    description: "禾赛科技聚焦激光雷达硬件、算法、嵌入式和制造测试，适合自动驾驶感知、光机电和测试验证方向学生。",
    lastVerifiedAt: null,
  },
];

const startDates: Record<string, string | null> = {
  未开始: "2026-07-01",
  已开启: "2026-05-20",
  即将截止: "2026-05-10",
  已结束: "2026-03-01",
  待确认: null,
};

const endDates: Record<string, string | null> = {
  未开始: "2026-08-15",
  已开启: "2026-07-20",
  即将截止: "2026-06-16",
  已结束: "2026-04-01",
  待确认: null,
};

const resourceTemplates = [
  {
    type: "面经",
    title: "自动驾驶算法面经准备清单",
    tags: ["自动驾驶", "C++", "车辆动力学"],
    summary: "按感知、预测、规划控制、仿真评测和项目复盘拆解准备点，适合自动驾驶算法与工程岗位面试前自查。",
  },
  {
    type: "面经",
    title: "嵌入式 C/C++ 面经复盘框架",
    tags: ["嵌入式", "C++", "测试验证"],
    summary: "覆盖 C/C++ 基础、内存、并发、通信协议、RTOS 和车载软件项目追问，适合嵌入式与车载软件方向。",
  },
  {
    type: "面经",
    title: "底盘/车辆动力学面经题纲",
    tags: ["底盘", "车辆动力学", "测试验证"],
    summary: "围绕悬架、制动、转向、整车动力学、仿真和试验验证组织复习路径，适合底盘与整车研发方向。",
  },
  {
    type: "笔试",
    title: "三电/电池/热管理笔试准备表",
    tags: ["三电", "电池", "热管理"],
    summary: "梳理电池系统、电机电控、热管理、BMS 和新能源车基础概念，适合三电、电池和热管理岗位准备。",
  },
  {
    type: "测评",
    title: "测评/行测经验与时间分配",
    tags: ["测试验证", "群面"],
    summary: "总结常见在线测评、行测、性格测评和群面流程的准备方法，不代表任何企业题库或官方口径。",
  },
  {
    type: "简历",
    title: "车辆方向简历项目包装建议",
    tags: ["HR面", "车辆动力学", "C++"],
    summary: "将课程设计、竞赛、仿真、控制、嵌入式和实习经历转化为岗位语言，适合投递前优化简历项目表达。",
  },
];

function dateOrNull(value: string | null) {
  return value ? new Date(`${value}T00:00:00Z`) : null;
}

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruitment.deleteMany();
  await prisma.company.deleteMany();

  for (const [index, item] of companies.entries()) {
    const verifiedAt = dateOrNull(item.lastVerifiedAt);
    const company = await prisma.company.create({
      data: {
        id: item.id,
        slug: item.id,
        name: item.name,
        shortName: item.shortName,
        type: item.type,
        category: item.type,
        description: item.description,
        officialWebsite: item.officialWebsite,
        campusRecruitmentWebsite: item.campusRecruitmentWebsite,
        campusUrl: item.campusRecruitmentWebsite,
        cities: stringifyStringList(item.cities),
        tags: stringifyStringList(item.tags),
        vehicleDirections: stringifyStringList(item.vehicleDirections),
        fitDirections: stringifyStringList(item.vehicleDirections),
        status: item.status,
        dataStatus: item.dataStatus,
        lastVerifiedAt: verifiedAt,
        lastUpdatedAt: new Date(`2026-06-${String((index % 10) + 1).padStart(2, "0")}T08:00:00Z`),
      },
    });

    const isOfficial = Boolean(item.campusRecruitmentWebsite && item.lastVerifiedAt);
    const startDate = dateOrNull(startDates[item.status]);
    const endDate = endDates[item.status] ? new Date(`${endDates[item.status]}T23:59:59Z`) : null;
    const recruitment = await prisma.recruitment.create({
      data: {
        companyId: company.id,
        year: 2027,
        targetYear: 2027,
        season: index % 4 === 0 ? "提前批" : index % 4 === 1 ? "秋招" : index % 4 === 2 ? "春招" : "实习转正",
        batch: index % 4 === 0 ? "提前批" : index % 4 === 1 ? "秋招" : index % 4 === 2 ? "春招" : "实习转正",
        title: `${item.shortName} 2027届校园招聘跟踪`,
        status: item.status,
        startDate,
        endDate,
        applyUrl: item.campusRecruitmentWebsite,
        process: "网申 → 测评/笔试 → 技术面 → 综合面/HR面 → Offer",
        note: isOfficial ? "已保留企业官方入口，投递前请再次确认岗位批次和城市。" : "当前缺少已核验的 2027 届官方投递入口，请以企业后续公告为准。",
        notes: isOfficial ? "已保留企业官方入口，投递前请再次确认岗位批次和城市。" : "当前缺少已核验的 2027 届官方投递入口，请以企业后续公告为准。",
        sourceUrl: item.campusRecruitmentWebsite,
        sourceType: isOfficial ? "官方招聘站" : "公开整理",
        credibility: isOfficial ? "官方" : "待核实",
      },
    });

    await prisma.job.createMany({
      data: item.vehicleDirections.slice(0, 3).map((direction, jobIndex) => ({
        companyId: company.id,
        recruitmentId: recruitment.id,
        programId: recruitment.id,
        title: `${direction}工程师`,
        direction,
        city: item.cities[jobIndex % item.cities.length],
        education: "本科/硕士及以上",
        majorRequirement: "车辆工程、机械工程、自动化、控制、电子信息、计算机等相关专业",
        majors: stringifyStringList(["车辆工程", "机械工程", "自动化", "控制工程", "电子信息", "计算机"]),
        skills: stringifyStringList(direction.includes("自动驾驶")
          ? ["C++", "Python", "算法基础", "仿真评测"]
          : direction.includes("嵌入式")
            ? ["C/C++", "CAN", "Linux/RTOS", "调试能力"]
            : ["车辆基础", "工程分析", "试验验证", "项目复盘"]),
        applyUrl: item.campusRecruitmentWebsite,
        vehicleFitScore: 92 - ((index + jobIndex * 5) % 22),
        matchScore: 92 - ((index + jobIndex * 5) % 22),
      })),
    });

    const resourceA = resourceTemplates[index % resourceTemplates.length];
    const resourceB = resourceTemplates[(index + 2) % resourceTemplates.length];
    await prisma.resource.createMany({
      data: [
        {
          companyId: company.id,
          title: `${item.shortName} ${resourceA.title}`,
          type: resourceA.type,
          targetYear: 2027,
          sourceYear: 2026,
          url: null,
          sourceUrl: null,
          source: "候选人经验整理（待补真实链接）",
          sourceType: "候选人经验",
          summary: resourceA.summary,
          credibility: "经验参考",
          tags: stringifyStringList(resourceA.tags),
          lastVerifiedAt: null,
        },
        {
          companyId: company.id,
          title: `${item.shortName} 官方投递入口与流程核验`,
          type: "投递攻略",
          targetYear: 2027,
          sourceYear: 2026,
          url: item.campusRecruitmentWebsite,
          sourceUrl: item.campusRecruitmentWebsite,
          source: item.campusRecruitmentWebsite ? "企业官方招聘站" : "公开信息整理（待补链接）",
          sourceType: item.campusRecruitmentWebsite ? "官方招聘站" : "公开整理",
          summary: item.campusRecruitmentWebsite
            ? `已整理 ${item.shortName} 官方招聘入口，投递前仍需核对 2027 届批次、城市和岗位要求。`
            : `${item.shortName} 暂未补充可核验的 2027 届官方投递入口，建议关注企业官网、公众号和学校就业网。`,
          credibility: item.campusRecruitmentWebsite ? "官方" : "待核实",
          tags: stringifyStringList(resourceB.tags),
          lastVerifiedAt: verifiedAt,
        },
      ],
    });

    const eventType = item.status === "未开始" ? "网申开始" : "网申截止";
    await prisma.calendarEvent.create({
      data: {
        companyId: company.id,
        recruitmentId: recruitment.id,
        programId: recruitment.id,
        title: `${item.shortName} ${eventType}`,
        eventType,
        eventDate: item.status === "未开始"
          ? new Date(`${startDates[item.status]}T09:00:00Z`)
          : item.status === "待确认"
            ? new Date(`2026-07-${String((index % 18) + 1).padStart(2, "0")}T09:00:00Z`)
            : new Date(`${endDates[item.status]}T18:00:00Z`),
        status: item.status,
        sourceUrl: item.campusRecruitmentWebsite,
        credibility: item.campusRecruitmentWebsite ? "官方" : "待核实",
      },
    });
  }

  const user = await prisma.user.create({
    data: { email: "demo@vehicle-campus.local", nickname: "示例管理员", role: "ADMIN" },
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
