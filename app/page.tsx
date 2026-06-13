import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Bot,
  CarFront,
  CheckCircle2,
  CircuitBoard,
  Gauge,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { OpportunityCard } from "@/components/home/opportunity-card";
import { RadarVisual } from "@/components/home/radar-visual";
import { UpdateFeed } from "@/components/home/update-feed";
import { DataState } from "@/components/ui/data-state";
import { DirectionCard } from "@/components/ui/direction-card";
import { getCompanies } from "@/lib/data";
import { isCohortEvidence, isUsableLinkEvidence } from "@/lib/domain";

const directionMeta = [
  ["自动驾驶", "感知、规划、控制与算法", Bot],
  ["嵌入式", "车载软件、控制器与通信", CircuitBoard],
  ["三电", "电机、电控与动力系统", BatteryCharging],
  ["底盘", "车辆动力学与底盘控制", Gauge],
  ["整车研发", "整车集成、试验与开发", CarFront],
  ["测试验证", "系统测试、标定与验证", Wrench],
] as const;

function formatDate(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "待人工确认";
}

export default async function HomePage() {
  try {
    const companies = await getCompanies();
    const active = companies.flatMap((company) => {
      const program = company.recruitments?.find(
        (item) =>
          item.targetYear === 2027 &&
          item.status.includes("开放") &&
          item.sourceLink &&
          isCohortEvidence(item.sourceLink, 2027),
      );
      return program ? [{ company, program }] : [];
    });
    const updates = companies
      .filter((company) => company.changeSummary)
      .sort((a, b) => Date.parse(b.lastUpdatedAt) - Date.parse(a.lastUpdatedAt))
      .slice(0, 5);
    const usableOfficialLinks = companies.filter((company) =>
      company.links?.some((link) => link.isPrimary && isUsableLinkEvidence(link)),
    ).length;
    const latestUpdate = updates[0];

    return (
      <>
        <section className="home-hero">
          <div className="shell home-hero-grid">
            <div className="home-hero-copy">
              <p className="page-kicker">2027 届车辆行业校招</p>
              <h1>更快找到适合你的车企机会</h1>
              <p>
                聚合车企、新势力、自动驾驶、三电与零部件企业的官方入口、招聘进度和技术方向，帮你少翻群聊，多做准备。
              </p>
              <form className="global-search" action="/companies">
                <Search size={20} aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  aria-label="搜索公司、技术方向或城市"
                  placeholder="搜索公司、技术方向或城市"
                />
                <button type="submit">
                  搜索机会
                  <ArrowRight size={17} />
                </button>
              </form>
              <div className="quick-links" aria-label="热门技术方向">
                <span>热门方向</span>
                {["自动驾驶", "嵌入式", "三电", "底盘", "热管理"].map((direction) => (
                  <Link
                    href={`/companies?direction=${encodeURIComponent(direction)}`}
                    key={direction}
                  >
                    {direction}
                  </Link>
                ))}
              </div>
            </div>
            {latestUpdate ? (
              <RadarVisual
                company={latestUpdate.shortName}
                summary={latestUpdate.changeSummary ?? "信息已更新"}
              />
            ) : null}
          </div>
        </section>

        <section className="shell metric-strip" aria-label="平台数据概览">
          <article>
            <strong>{companies.length}</strong>
            <span>已收录企业</span>
          </article>
          <article>
            <strong>{usableOfficialLinks}</strong>
            <span>可用招聘入口</span>
          </article>
          <article>
            <strong>{active.length}</strong>
            <span>明确 2027 项目</span>
          </article>
          <article>
            <strong>{formatDate(latestUpdate?.lastUpdatedAt)}</strong>
            <span>最近数据更新</span>
          </article>
        </section>

        <section className="shell section-block">
          <div className="section-title">
            <div>
              <p className="page-kicker">正在招聘</p>
              <h2>现在值得关注的机会</h2>
              <p>只展示页面明确面向 2027 届、且官方入口仍可访问的项目。</p>
            </div>
            <Link className="section-link" href="/companies">
              查看全部企业
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="opportunity-grid">
            {active.slice(0, 3).map(({ company, program }) => (
              <OpportunityCard company={company} program={program} key={company.id} />
            ))}
          </div>
        </section>

        <section className="shell section-block insight-grid">
          <div>
            <div className="section-title section-title-compact">
              <div>
                <p className="page-kicker">最近变化</p>
                <h2>信息更新，不让你错过变化</h2>
              </div>
            </div>
            <UpdateFeed companies={updates} />
          </div>
          <aside className="starter-card">
            <span className="starter-icon">
              <CheckCircle2 size={22} />
            </span>
            <p className="page-kicker">第一次来？</p>
            <h2>用三步建立你的校招清单</h2>
            <ol>
              <li>
                <strong>01</strong>
                按方向筛出适合的企业
              </li>
              <li>
                <strong>02</strong>
                查看当前项目和官方入口
              </li>
              <li>
                <strong>03</strong>
                用求职指南准备简历和面试
              </li>
            </ol>
            <Link href="/resources">
              开始准备
              <ArrowRight size={16} />
            </Link>
          </aside>
        </section>

        <section className="shell section-block">
          <div className="section-title">
            <div>
              <p className="page-kicker">技术方向</p>
              <h2>按车辆技术方向找机会</h2>
              <p>从你熟悉的专业和技能出发，快速缩小企业范围。</p>
            </div>
          </div>
          <div className="direction-grid">
            {directionMeta.map(([title, description, icon]) => (
              <DirectionCard
                count={
                  companies.filter((company) => company.vehicleDirections.includes(title)).length
                }
                description={description}
                icon={icon}
                key={title}
                title={title}
              />
            ))}
          </div>
        </section>

        <section className="shell verification-callout">
          <span className="verification-icon">
            <ShieldCheck size={24} />
          </span>
          <div>
            <p className="page-kicker">信息原则</p>
            <h2>每条机会，都说明信息从哪里来</h2>
            <p>
              我们区分具体校招项目、校园招聘门户和通用招聘官网；没有可靠日期就不显示精确日期，没有有效入口就明确标记待补充。
            </p>
          </div>
          <Link href="/about">
            了解我们的核验方式
            <ArrowRight size={17} />
          </Link>
        </section>
      </>
    );
  } catch {
    return (
      <div className="shell page-space">
        <DataState />
      </div>
    );
  }
}
