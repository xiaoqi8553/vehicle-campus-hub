import Link from "next/link";
import { ArrowRight, BookOpenCheck, Building2, CalendarClock, RadioTower } from "lucide-react";
import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  try {
    const [companies, resourceCount] = await Promise.all([
      getCompanies(),
      prisma.resource.count(),
    ]);
    const stats = [
      { label: "已收录企业", value: companies.length, icon: Building2 },
      { label: "校招已开启", value: companies.filter((item) => item.status === "已开启").length, icon: RadioTower },
      { label: "即将截止", value: companies.filter((item) => item.status === "即将截止").length, icon: CalendarClock },
      { label: "笔试面试资料", value: resourceCount, icon: BookOpenCheck },
    ];

    return (
      <>
        <section className="hero">
          <div className="hero-grid-lines" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">VEHICLE TALENT INTELLIGENCE / 2027</p>
              <h1><span>Vehicle Campus Hub</span>车辆行业校招信息，一站式汇总</h1>
              <p className="hero-lead">聚合车企、自动驾驶公司、零部件企业与新能源三电企业的校园招聘信息，为车辆、机械、自动驾驶、嵌入式方向学生提供清晰的求职雷达。</p>
              <div className="hero-actions">
                <Link href="#companies" className="button button-accent">浏览校招企业<ArrowRight size={16} /></Link>
                <Link href="/calendar" className="button button-ghost">查看校招日历</Link>
              </div>
            </div>
            <div className="hero-dashboard" aria-hidden="true">
              <div className="dashboard-header"><span>INDUSTRY SIGNAL</span><i /></div>
              <div className="radar">
                <div className="radar-ring ring-one" /><div className="radar-ring ring-two" />
                <div className="radar-sweep" /><span className="radar-dot dot-one" /><span className="radar-dot dot-two" /><span className="radar-dot dot-three" />
                <strong>25</strong><small>TRACKED COMPANIES</small>
              </div>
              <div className="dashboard-ticks"><span>整车</span><span>三电</span><span>智驾</span><span>软件</span></div>
            </div>
          </div>
        </section>

        <section className="stats-band">
          <div className="shell stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return <article key={stat.label}><Icon size={20} /><div><strong>{stat.value}</strong><span>{stat.label}</span></div></article>;
            })}
          </div>
        </section>

        <section className="shell page-section" id="companies">
          <div className="section-heading">
            <div><p className="eyebrow">CAMPUS RECRUITMENT INDEX</p><h2>寻找你的目标企业</h2></div>
            <p>从行业类型、校招状态和岗位方向切入，快速缩小投递范围。</p>
          </div>
          <CompanyExplorer companies={companies} />
        </section>

        <section className="about-band" id="about">
          <div className="shell about-grid">
            <div><p className="eyebrow">WHY THIS PROJECT</p><h2>为车辆研究生重做校招信息结构</h2></div>
            <div className="about-points">
              <p><strong>01</strong>不只列公司，更明确车辆方向适配度与准备技能。</p>
              <p><strong>02</strong>官方信息、公开整理和候选人经验按可信度区分。</p>
              <p><strong>03</strong>数据 API 可继续复用到微信小程序与移动应用。</p>
            </div>
          </div>
        </section>
      </>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
