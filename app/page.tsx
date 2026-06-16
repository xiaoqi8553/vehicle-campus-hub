import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { OpportunityCard } from "@/components/home/opportunity-card";
import { RadarVisual } from "@/components/home/radar-visual";
import { UpdateFeed } from "@/components/home/update-feed";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";
import { isCohortEvidence, isUsableLinkEvidence } from "@/lib/domain";

const quickDirections = ["自动驾驶", "嵌入式", "三电", "底盘", "热管理"];

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
    const verifiedEntrance = companies
      .filter(
        (company) =>
          !active.some((item) => item.company.id === company.id) &&
          company.links?.some((link) => link.isPrimary && isUsableLinkEvidence(link)),
      )
      .slice(0, 3);
    const watchlist = companies
      .filter(
        (company) =>
          !active.some((item) => item.company.id === company.id) &&
          !verifiedEntrance.some((item) => item.id === company.id),
      )
      .slice(0, 2);
    const highlighted = [
      ...active.map((item) => ({ ...item, variant: "open" as const })),
      ...verifiedEntrance.map((company) => ({
        company,
        program: null,
        variant: "verified" as const,
      })),
      ...watchlist.map((company) => ({ company, program: null, variant: "watch" as const })),
    ].slice(0, 6);
    const updates = companies
      .filter((company) => ["byd", "xpeng", "xiaomi-auto", "bosch", "zf"].includes(company.id))
      .sort(
        (a, b) =>
          ["byd", "xpeng", "xiaomi-auto", "bosch", "zf"].indexOf(a.id) -
          ["byd", "xpeng", "xiaomi-auto", "bosch", "zf"].indexOf(b.id),
      );
    const usableOfficialLinks = companies.filter((company) =>
      company.links?.some((link) => link.isPrimary && isUsableLinkEvidence(link)),
    ).length;
    const latestUpdate = updates[0];

    return (
      <>
        <section className="home-hero">
          <div className="shell home-hero-grid">
            <div className="home-hero-copy">
              <p className="page-kicker">2027 届</p>
              <h1>车辆行业 2027 届校招信息汇总</h1>
              <p>
                面向车辆、机械、自动化、控制、嵌入式、三电等方向同学，收录官方招聘入口、校园招聘项目、截止时间和来源核验记录。
              </p>
              <form className="global-search" action="/companies">
                <Search size={20} aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  aria-label="搜索公司、技术方向或城市"
                  placeholder="搜索公司、方向或城市"
                />
                <button type="submit">
                  搜索
                  <ArrowRight size={17} />
                </button>
              </form>
              <div className="quick-links" aria-label="热门技术方向">
                <span>方向快捷筛选</span>
                {quickDirections.map((direction) => (
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
                summary={latestUpdate.changeSummary ?? "招聘入口已核验"}
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
              <p className="page-kicker">招聘机会</p>
              <h2>现在值得关注的机会</h2>
              <p>
                已开放项目和近期核验的官方招聘入口分层展示；通用招聘官网不会被标记为 2027
                届已开放项目。
              </p>
            </div>
            <Link className="section-link" href="/companies">
              查看全部企业
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="opportunity-grid">
            {highlighted.map(({ company, program, variant }) => (
              <OpportunityCard
                company={company}
                program={program}
                variant={variant}
                key={company.id}
              />
            ))}
          </div>
        </section>

        <section className="shell section-block insight-grid">
          <div>
            <div className="section-title section-title-compact">
              <div>
                <p className="page-kicker">最近核验</p>
                <h2>近期可用入口与项目状态</h2>
              </div>
            </div>
            <UpdateFeed companies={updates} />
          </div>
          <aside className="starter-card">
            <span className="starter-icon">
              <CheckCircle2 size={22} />
            </span>
            <p className="page-kicker">使用方式</p>
            <h2>按方向、入口和核验状态建立投递清单</h2>
            <ol>
              <li>
                <strong>01</strong>
                在公司机会页按车辆方向筛选企业
              </li>
              <li>
                <strong>02</strong>
                区分 2027 项目、校园门户和通用招聘官网
              </li>
              <li>
                <strong>03</strong>
                结合求职指南准备简历、笔试和面试
              </li>
            </ol>
            <Link href="/resources">
              查看求职指南
              <ArrowRight size={16} />
            </Link>
          </aside>
        </section>

        <section className="shell verification-callout">
          <span className="verification-icon">
            <ShieldCheck size={24} />
          </span>
          <div>
            <p className="page-kicker">信息原则</p>
            <h2>每条招聘入口都保留来源和核验时间</h2>
            <p>
              平台区分具体校招项目、校园招聘门户和通用招聘官网；没有可靠日期不显示精确日期，没有有效入口则标记为待补充。
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
