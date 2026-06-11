import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Database, Link2, Radar } from "lucide-react";
import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";

export default async function HomePage() {
  try {
    const companies = await getCompanies();
    const verified = companies.filter((company) => company.verifiedAt);
    const active = companies.filter((company) => company.recruitments?.some((item) => item.targetYear === 2027));
    const updates = companies.filter((company) => company.changeSummary).slice(0, 5);

    return (
      <>
        <section className="terminal-hero">
          <div className="shell terminal-hero-grid">
            <div>
              <p className="eyebrow">VEHICLE CAMPUS INTELLIGENCE / 2027</p>
              <h1>2027届车辆行业校招雷达</h1>
              <p className="hero-lead">聚合车企、新势力、自动驾驶、三电与零部件企业的官方招聘入口和可核验证据。未发布的信息保持未知，不用推测填满页面。</p>
              <div className="hero-actions">
                <Link className="button button-primary" href="#company-search">检索企业<ArrowRight size={16} /></Link>
                <Link className="button button-secondary" href="/calendar">查看日历证据</Link>
              </div>
            </div>
            <div className="signal-panel" aria-label="数据快照">
              <span className="signal-line"><i />DATA SNAPSHOT · 2026-06-11</span>
              <strong>{companies.length}</strong>
              <p>家车辆产业链企业持续跟踪</p>
              <div><span>{verified.length} 家入口已复核</span><span>{active.length} 家有明确 2027 实习证据</span></div>
            </div>
          </div>
        </section>

        <section className="shell metric-strip" aria-label="平台统计">
          <article><Database size={18} /><div><strong>{companies.length}</strong><span>跟踪企业</span></div></article>
          <article><CheckCircle2 size={18} /><div><strong>{verified.length}</strong><span>入口已复核</span></div></article>
          <article><Radar size={18} /><div><strong>{active.length}</strong><span>2027 证据项目</span></div></article>
          <article><Link2 size={18} /><div><strong>{companies.length - verified.length}</strong><span>待再次复核</span></div></article>
        </section>

        <section className="shell page-section" id="company-search">
          <div className="section-heading">
            <div><p className="eyebrow">COMPANY INDEX</p><h2>企业快速检索</h2></div>
            <p>首页只展示前 8 条结果。完整筛选、排序与全部企业记录在公司情报库中。</p>
          </div>
          <CompanyExplorer companies={companies} limit={8} />
        </section>

        <section className="shell page-section intelligence-grid">
          <div>
            <div className="section-heading compact-heading"><div><p className="eyebrow">VERIFIED SIGNALS</p><h2>已核验动态</h2></div></div>
            <div className="update-list">
              {updates.map((company) => (
                <Link href={`/companies/${company.slug}`} className="update-row" data-testid="latest-update" key={company.id}>
                  <span>{company.shortName}</span>
                  <strong>{company.changeSummary}</strong>
                  <small>核验于 {company.verifiedAt ? new Date(company.verifiedAt).toLocaleDateString("zh-CN") : "待补充"}</small>
                </Link>
              ))}
            </div>
          </div>
          <aside className="method-panel">
            <Clock3 size={20} />
            <p className="eyebrow">EVIDENCE POLICY</p>
            <h2>信息来源与核验规则</h2>
            <ol>
              <li>招聘状态必须有企业官网、官方招聘站或明确官方页面支撑。</li>
              <li>没有核验日期时不展示精确开始或截止时间。</li>
              <li>招聘官网不等于 2027 届项目已开启，二者分开标注。</li>
            </ol>
            <Link href="/about">查看完整规则<ArrowRight size={15} /></Link>
          </aside>
        </section>
      </>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
