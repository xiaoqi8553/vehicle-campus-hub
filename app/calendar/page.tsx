import Link from "next/link";
import { ArrowRight, CalendarClock, ShieldAlert } from "lucide-react";
import { CompanyLinkAction } from "@/components/company/company-link";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";
import { isCohortEvidence } from "@/lib/domain";

function date(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value))
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
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">2027 RECRUITMENT TIMELINE</p>
          <h1>2027届车辆行业校招日历</h1>
          <p>
            没有经过核验的日期就不放进日历。当前页面把“项目已开放但未公布截止日期”和“尚未发布项目”分开呈现。
          </p>
        </div>

        <section className="calendar-summary">
          <article>
            <strong>0</strong>
            <span>7 天内截止</span>
          </article>
          <article>
            <strong>0</strong>
            <span>30 天内截止</span>
          </article>
          <article>
            <strong>{openUndated.length}</strong>
            <span>开放但无截止日期</span>
          </article>
        </section>

        <section className="calendar-timeline">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">OPEN / DATE UNKNOWN</p>
              <h2>已开放但未公布截止日期</h2>
            </div>
            <p>可确认届次与项目存在，但不能推测开始或截止日期。</p>
          </div>
          <div className="undated-list">
            {openUndated.map(({ company, program }) => (
              <article className="undated-row" data-testid="open-undated-row" key={program.id}>
                <CalendarClock size={20} />
                <div>
                  <strong>{company.name}</strong>
                  <span>{program.title}</span>
                </div>
                <p>
                  截止日期未公布<small>核验于 {date(program.verifiedAt)}</small>
                </p>
                <CompanyLinkAction companyName={company.name} link={program.sourceLink} />
              </article>
            ))}
          </div>
        </section>

        <section className="watchlist-section">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">NOT PUBLISHED</p>
              <h2>尚未发布 2027 项目</h2>
            </div>
            <p>这些企业已进入观察名单，但通用招聘站不能证明 2027 届项目开放。</p>
          </div>
          <div className="watchlist-table" role="table" aria-label="尚未发布 2027 项目的企业">
            <div className="watchlist-head" role="row">
              <span role="columnheader">企业</span>
              <span role="columnheader">公司类型</span>
              <span role="columnheader">当前判断</span>
              <span role="columnheader">档案</span>
            </div>
            {unpublished.map((company) => (
              <div
                className="watchlist-row"
                data-testid="watchlist-row"
                role="row"
                key={company.id}
              >
                <strong role="cell">{company.name}</strong>
                <span role="cell">{company.type}</span>
                <span role="cell">
                  <ShieldAlert size={14} />
                  未发现明确 2027 项目证据
                </span>
                <Link
                  role="cell"
                  href={`/companies/${company.slug}`}
                  aria-label={`查看${company.name}证据档案`}
                >
                  查看档案
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </section>
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
