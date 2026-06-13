import Link from "next/link";
import { ArrowRight, Clock3, SearchCheck, ShieldCheck } from "lucide-react";
import { CompanyLinkAction } from "@/components/company/company-link";
import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";
import { isCohortEvidence } from "@/lib/domain";

function date(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value))
    : "待人工确认";
}

export default async function HomePage() {
  try {
    const companies = await getCompanies();
    const active = companies.filter((company) =>
      company.recruitments?.some(
        (program) =>
          program.targetYear === 2027 &&
          program.status.includes("开放") &&
          program.sourceLink &&
          isCohortEvidence(program.sourceLink, 2027),
      ),
    );
    const updates = companies
      .filter((company) => company.changeSummary)
      .sort((a, b) => Date.parse(b.lastUpdatedAt) - Date.parse(a.lastUpdatedAt))
      .slice(0, 5);

    return (
      <>
        <section className="terminal-hero">
          <div className="shell terminal-hero-grid">
            <div className="hero-copy">
              <p className="hero-cohort">2027届</p>
              <h1>车辆行业校招情报</h1>
              <p className="hero-lead">
                官方入口、招聘批次与核验证据。先判断链接是什么、是否有效、何时核验，再决定下一步。
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="#company-search">
                  开始搜索
                  <ArrowRight size={16} />
                </Link>
                <Link className="button button-secondary" href="/about">
                  了解核验规则
                </Link>
              </div>
            </div>
            <aside className="signal-panel" aria-label="平台数据快照">
              <span className="signal-line">
                <i />
                LINK EVIDENCE · 2026-06-11
              </span>
              <div className="signal-metrics">
                <p>
                  <strong>{companies.length}</strong>
                  <span>跟踪企业</span>
                </p>
                <p>
                  <strong>{active.length}</strong>
                  <span>明确 2027 机会</span>
                </p>
              </div>
              <small>通用招聘官网不会被计入 2027 届开放项目。</small>
            </aside>
          </div>
        </section>

        <section className="shell page-section search-first" id="company-search">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SEARCH FIRST</p>
              <h2>先找公司，再看证据</h2>
            </div>
            <p>支持公司、城市和车辆方向搜索。首页只保留少量结果，完整比较进入公司库。</p>
          </div>
          <CompanyExplorer companies={companies} limit={6} mobileLimit={3} />
        </section>

        <section className="shell page-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPEN NOW</p>
              <h2>当前明确开放的 2027 项目</h2>
            </div>
            <p>仅包含可访问的官方页面，且页面正文明确提到 2027 届。</p>
          </div>
          <div className="opportunity-list">
            {active.map((company) => {
              const program = company.recruitments?.find((item) => item.targetYear === 2027);
              return (
                <article className="opportunity-row" key={company.id}>
                  <div>
                    <span>{company.type}</span>
                    <h3>
                      <a href={`/companies/${company.slug}`}>{company.name}</a>
                    </h3>
                  </div>
                  <p>
                    {program?.title}
                    <small>核验于 {date(program?.verifiedAt)} · 截止日期未公布</small>
                  </p>
                  <CompanyLinkAction companyName={company.name} link={program?.sourceLink} />
                </article>
              );
            })}
          </div>
        </section>

        <section className="shell page-section intelligence-grid">
          <div>
            <div className="section-heading compact-heading">
              <div>
                <p className="eyebrow">RECENT CHANGES</p>
                <h2>最近核验变化</h2>
              </div>
            </div>
            <div className="update-list">
              {updates.map((company) => (
                <a
                  href={`/companies/${company.slug}`}
                  className="update-row"
                  data-testid="latest-update"
                  key={company.id}
                >
                  <span>{company.shortName}</span>
                  <strong>{company.changeSummary}</strong>
                  <small>{date(company.lastUpdatedAt)}</small>
                </a>
              ))}
            </div>
          </div>
          <aside className="method-panel">
            <ShieldCheck size={21} />
            <p className="eyebrow">READ BEFORE APPLY</p>
            <h2>链接先解释，按钮后出现</h2>
            <ol>
              <li>
                <SearchCheck size={15} />
                先看来源类型、官方域名和面向届次。
              </li>
              <li>
                <Clock3 size={15} />
                再看健康状态与最后核验时间。
              </li>
              <li>
                <ShieldCheck size={15} />
                失效或受限链接不会伪装成正常主按钮。
              </li>
            </ol>
            <Link href="/about">
              查看完整证据规则
              <ArrowRight size={15} />
            </Link>
          </aside>
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
