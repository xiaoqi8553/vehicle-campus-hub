import Link from "next/link";
import { ArrowRight, CalendarClock, CalendarX2, CheckCircle2, Eye } from "lucide-react";
import { CompanyLinkAction } from "@/components/company/company-link";
import { DataState } from "@/components/ui/data-state";
import { PageHero } from "@/components/ui/page-hero";
import { getCompanies } from "@/lib/data";
import { isCohortEvidence } from "@/lib/domain";

function formatDate(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "待人工确认";
}

export default async function CalendarPage() {
  try {
    const companies = await getCompanies();
    const openUndated = companies.flatMap((company) => {
      const program = company.recruitments?.find(
        (item) =>
          item.targetYear === 2027 &&
          item.status.includes("开放") &&
          item.sourceLink &&
          isCohortEvidence(item.sourceLink, 2027),
      );
      return program ? [{ company, program }] : [];
    });
    const unpublished = companies.filter(
      (company) => !openUndated.some((item) => item.company.id === company.id),
    );

    return (
      <div className="shell page-space calendar-page">
        <PageHero
          eyebrow="招聘日历"
          title="车辆行业校招日历"
          description="只把来源可靠、日期明确的招聘节点放进时间线。官方尚未公布截止日期的项目会单独展示，不使用往届时间或推测日期代替。"
          aside={
            <div className="page-stat-pills">
              <span>
                <CheckCircle2 size={16} />
                {openUndated.length} 个明确项目
              </span>
              <span>{unpublished.length} 家持续观察</span>
            </div>
          }
        />

        <section className="calendar-metric-grid" aria-label="招聘节点概览">
          <article>
            <span className="calendar-metric-icon metric-danger">7</span>
            <div>
              <strong>7 天内截止</strong>
              <p>暂无日期经过核验的截止事件</p>
            </div>
            <b>0</b>
          </article>
          <article>
            <span className="calendar-metric-icon metric-warning">30</span>
            <div>
              <strong>30 天内截止</strong>
              <p>暂无日期经过核验的截止事件</p>
            </div>
            <b>0</b>
          </article>
          <article>
            <span className="calendar-metric-icon metric-primary">
              <CalendarClock size={20} />
            </span>
            <div>
              <strong>本月新开启</strong>
              <p>等待官方日期信息</p>
            </div>
            <b>0</b>
          </article>
        </section>

        <section className="section-block calendar-confirmed-section">
          <div className="section-title">
            <div>
              <p className="page-kicker">已核验时间线</p>
              <h2>近期明确招聘节点</h2>
              <p>当前没有同时具备可靠来源和明确日期的事件。</p>
            </div>
          </div>
          <div className="calendar-empty-state">
            <span>
              <CalendarX2 size={25} />
            </span>
            <div>
              <strong>暂时没有可以确认的截止日期</strong>
              <p>这不代表企业没有招聘，只表示官方页面尚未公布可核验日期。</p>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-title">
            <div>
              <p className="page-kicker">正在招聘 · 日期待公布</p>
              <h2>已开放但未公布截止日期</h2>
              <p>项目和届次已经确认，截止日期保持未知。建议尽早查看官方页面。</p>
            </div>
          </div>
          <div className="undated-opportunity-grid">
            {openUndated.map(({ company, program }) => (
              <article
                className="undated-opportunity-card"
                data-testid="open-undated-row"
                key={program.id}
              >
                <div className="undated-opportunity-top">
                  <span className="company-avatar">{company.shortName.slice(0, 1)}</span>
                  <span className="undated-label">截止日期未公布</span>
                </div>
                <h3>{company.name}</h3>
                <p>{program.title}</p>
                <small>最后核验 {formatDate(program.verifiedAt)}</small>
                <CompanyLinkAction companyName={company.name} link={program.sourceLink} />
              </article>
            ))}
          </div>
        </section>

        <aside className="calendar-watchlist-callout">
          <span>
            <Eye size={23} />
          </span>
          <div>
            <strong>还有 {unpublished.length} 家企业尚未发布明确的 2027 届项目</strong>
            <p>它们仍在跟踪列表中，但不会在日历里重复显示相同的待确认记录。</p>
          </div>
          <Link href="/companies?status=待确认" aria-label="查看企业观察名单">
            查看企业观察名单
            <ArrowRight size={17} />
          </Link>
        </aside>
      </div>
    );
  } catch {
    return (
      <div className="shell page-space">
        <DataState />
      </div>
    );
  }
}
