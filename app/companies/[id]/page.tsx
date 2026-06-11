import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ExternalLinkIcon, MapPin, ShieldCheck } from "lucide-react";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCompanyDetail } from "@/lib/data";
import { sourceTypeLabel } from "@/lib/domain";

function date(value: string | null) {
  return value ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value)) : "待补充";
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyDetail(id);
  if (!company) notFound();

  const program = company.recruitments.find((item) => item.targetYear === 2027);

  return (
    <div className="shell page-space detail-page">
      <Link className="back-link" href="/companies"><ArrowLeft size={16} />返回公司情报库</Link>
      <header className="company-dossier">
        <div className="dossier-mark">{company.shortName.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">{company.type} / COMPANY DOSSIER</p>
          <h1>{company.name}</h1>
          <p>{company.description}</p>
          <div className="dossier-badges">
            <StatusBadge status={program?.status ?? company.status} />
            <span>{company.dataStatus}</span>
            <span>最后核验 {date(company.verifiedAt)}</span>
          </div>
        </div>
        <div className="dossier-actions">
          <ExternalLink href={company.recruitmentWebsite} className="button button-primary" emptyLabel="招聘官网待复核">招聘官网</ExternalLink>
          <ExternalLink href={company.officialWebsite} className="button button-secondary" emptyLabel="公司官网待补">公司官网</ExternalLink>
        </div>
      </header>

      <div className="detail-layout">
        <main className="detail-main">
          <section className="detail-section">
            <div className="detail-section-title"><Building2 size={20} /><h2>公司基础信息</h2></div>
            <div className="info-grid">
              <div><MapPin size={17} /><span>主要城市</span><strong>{company.cities.join(" / ")}</strong></div>
              <div><BriefcaseBusiness size={17} /><span>企业类型</span><strong>{company.type}</strong></div>
              <div><ShieldCheck size={17} /><span>入口核验</span><strong>{company.dataStatus}</strong></div>
              <div><CalendarDays size={17} /><span>内容更新</span><strong>{date(company.lastUpdatedAt)}</strong></div>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><CheckCircle2 size={20} /><h2>官方招聘信息</h2></div>
            {program ? (
              <article className="official-program">
                <div>
                  <p className="eyebrow">{program.targetYear}届 / {program.batch}</p>
                  <h3>{program.title}</h3>
                  <p>{program.notes}</p>
                </div>
                <StatusBadge status={program.status} />
                <dl>
                  <div><dt>开始时间</dt><dd>待官方发布</dd></div>
                  <div><dt>截止时间</dt><dd>待官方发布</dd></div>
                  <div><dt>来源类型</dt><dd>{sourceTypeLabel(program.sourceType)}</dd></div>
                  <div><dt>核验时间</dt><dd>{date(program.verifiedAt)}</dd></div>
                </dl>
                <div className="inline-actions">
                  <ExternalLink href={program.applyUrl} className="button button-primary" emptyLabel="申请入口待补">查看官方项目</ExternalLink>
                  <ExternalLink href={program.sourceUrl} emptyLabel="来源待补">核对来源</ExternalLink>
                </div>
              </article>
            ) : (
              <div className="data-state">
                <strong>尚未发现明确的 2027 届官方项目</strong>
                <p>已保留招聘官网用于持续跟踪，但不会据此推断项目已开放。</p>
              </div>
            )}
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><BriefcaseBusiness size={20} /><h2>官方岗位</h2></div>
            {company.jobs.length ? company.jobs.map((job) => (
              <article className="job-row" key={job.id}>
                <div><strong>{job.title}</strong><span>{job.city} · {job.education}</span></div>
                <ExternalLink href={job.applyUrl} emptyLabel="岗位链接待补">岗位投递</ExternalLink>
              </article>
            )) : (
              <div className="data-state"><strong>当前没有已核验的具体岗位</strong><p>只有获得具体岗位名称与官方岗位 URL 后才会在此发布。</p></div>
            )}
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><ExternalLinkIcon size={20} /><h2>岗位方向参考</h2></div>
            <p className="section-note">以下方向来自企业公开业务与车辆产业分类，仅用于确定准备方向，不代表企业当前正在招聘。</p>
            <div className="direction-matrix">
              {company.vehicleDirections.map((direction, index) => <span key={direction}><i>{String(index + 1).padStart(2, "0")}</i>{direction}</span>)}
            </div>
          </section>
        </main>

        <aside className="detail-aside">
          <section className="source-ledger">
            <p className="eyebrow">SOURCE LEDGER</p>
            <h2>证据台账</h2>
            <dl>
              <div><dt>招聘入口</dt><dd>{company.recruitmentWebsite ? "已收录" : "待补充"}</dd></div>
              <div><dt>2027 项目</dt><dd>{program ? "官方证据" : "未发现"}</dd></div>
              <div><dt>精确日期</dt><dd>未发布</dd></div>
              <div><dt>具体岗位</dt><dd>{company.jobs.length ? `${company.jobs.length} 条` : "未核验"}</dd></div>
            </dl>
          </section>
          <section className="notice-card">
            <strong>使用说明</strong>
            <p>招聘页面可能动态更新。投递前请再次核对项目届别、岗位城市和截止时间。</p>
            <Link href="/about#feedback">反馈纠错<ArrowRight size={15} /></Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
