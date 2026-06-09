import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  MapPin,
  Route,
} from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { fitScoreLevel, generateVehicleAdvice } from "@/lib/domain";
import { getCompanyDetail } from "@/lib/data";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyDetail(id);
  if (!company) notFound();
  const advice = generateVehicleAdvice(company.tags, company.jobs.map((job) => job.direction));

  return (
    <div className="detail-page">
      <section className="detail-hero">
        <div className="shell">
          <Link className="back-link" href="/companies"><ArrowLeft size={16} />返回公司库</Link>
          <div className="detail-title-row">
            <div className="detail-monogram">{company.name.slice(0, 1)}</div>
            <div className="detail-title">
              <div className="tag-row"><span className="tag">{company.category}</span><StatusBadge status={company.status} /></div>
              <h1>{company.name}</h1>
              <p>{company.description}</p>
            </div>
            <div className="detail-actions">
              <ExternalLink href={company.campusUrl}>校招官网</ExternalLink>
              <ExternalLink href={company.officialWebsite} emptyLabel="暂无公司官网">公司官网</ExternalLink>
            </div>
          </div>
        </div>
      </section>

      <div className="shell detail-layout">
        <div className="detail-main">
          <DetailSection title="公司基础信息" icon={Building2}>
            <div className="info-grid">
              <Info label="主要城市" value={company.cities.join(" / ")} icon={MapPin} />
              <Info label="最后更新" value={new Date(company.lastUpdatedAt).toLocaleDateString("zh-CN")} icon={CalendarDays} />
              <Info label="企业标签" value={company.tags.join(" · ")} icon={CheckCircle2} />
              <Info label="适合方向" value={company.fitDirections.join(" · ")} icon={Route} />
            </div>
          </DetailSection>

          <DetailSection title="校招项目" icon={CalendarDays}>
            <div className="stack-list">
              {company.recruitments.map((item) => (
                <article className="recruitment-card" key={item.id}>
                  <div><p className="eyebrow">{item.year} 届 / {item.season}</p><h3>{item.title}</h3></div>
                  <StatusBadge status={item.status} />
                  <div className="timeline-meta">
                    <span>开始：{item.startDate ? new Date(item.startDate).toLocaleDateString("zh-CN") : "待确认"}</span>
                    <span>截止：{item.endDate ? new Date(item.endDate).toLocaleDateString("zh-CN") : "待确认"}</span>
                    <span>可信度：{item.credibility}</span>
                  </div>
                  <p className="process-line"><Route size={16} />{item.process}</p>
                  <div className="inline-actions">
                    <ExternalLink href={item.applyUrl}>立即投递</ExternalLink>
                    <ExternalLink href={item.sourceUrl} emptyLabel="暂无来源链接">信息来源</ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="车辆相关岗位" icon={BriefcaseBusiness}>
            <div className="job-list">
              {company.jobs.map((job) => {
                const fit = fitScoreLevel(job.vehicleFitScore);
                return (
                  <article className="job-card" key={job.id}>
                    <div className="job-score"><strong>{job.vehicleFitScore}</strong><span className={fit.className}>{fit.label}</span></div>
                    <div><p className="eyebrow">{job.direction}</p><h3>{job.title}</h3><p>{job.city} · {job.education}</p><small>{job.majorRequirement}</small></div>
                    <ExternalLink href={job.applyUrl}>岗位投递</ExternalLink>
                  </article>
                );
              })}
            </div>
          </DetailSection>

          <DetailSection title="笔试面试资料" icon={FileText}>
            <div className="resource-grid detail-resources">
              {company.resources.map((resource) => (
                <article className="resource-card" key={resource.id}>
                  <div className="resource-heading"><span className="tag">{resource.type}</span><span className="credibility">{resource.credibility}</span></div>
                  <h3>{resource.title}</h3><p>{resource.summary}</p><small>{resource.source}</small>
                  <ExternalLink href={resource.url} emptyLabel="暂无外部链接">查看资料</ExternalLink>
                </article>
              ))}
            </div>
          </DetailSection>
        </div>

        <aside className="detail-aside">
          <div className="advice-card">
            <GraduationCap size={25} />
            <p className="eyebrow">PREPARATION MAP</p>
            <h2>求职准备建议</h2>
            <p>结合企业标签与当前岗位方向生成，建议在简历和项目复盘中重点体现：</p>
            <div className="advice-list">{advice.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <div className="notice-card">
            <strong>信息来源声明</strong>
            <p>本平台信息为聚合整理，时间与岗位可能动态变化，具体以企业官方招聘网站为准。</p>
            <a href="mailto:feedback@example.com" className="text-link">反馈纠错</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }: { title: string; icon: typeof Building2; children: React.ReactNode }) {
  return <section className="detail-section"><div className="detail-section-title"><Icon size={20} /><h2>{title}</h2></div>{children}</section>;
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Building2 }) {
  return <div className="info-item"><Icon size={18} /><div><span>{label}</span><strong>{value || "待确认"}</strong></div></div>;
}
