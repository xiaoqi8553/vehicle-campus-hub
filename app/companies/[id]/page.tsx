import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  HelpCircle,
  MapPin,
  MessageSquareWarning,
  Route,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { generateVehicleAdvice, sourceTypeLabel, vehicleRelevance } from "@/lib/domain";
import { getCompanyDetail } from "@/lib/data";

const JOB_GROUPS = [
  "整车研发",
  "底盘",
  "三电",
  "电池",
  "热管理",
  "自动驾驶",
  "嵌入式",
  "智能座舱",
  "测试验证",
] as const;

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyDetail(id);
  if (!company) notFound();

  const program = company.recruitments.find((item) => item.targetYear === 2027) ?? company.recruitments[0];
  const advice = generateVehicleAdvice(company.tags, company.jobs.map((job) => job.direction));
  const faqItems = [
    {
      question: `${company.shortName} 2027届当前能直接投递吗？`,
      answer: program?.applyUrl
        ? "页面已保留官方投递入口，但提交前仍需核对企业站内批次、岗位城市和截止时间。"
        : "当前缺少已核验的官方投递入口，建议先加入关注清单，等待企业官网、官方公众号或学校就业网发布。",
    },
    {
      question: "哪些岗位方向更值得优先准备？",
      answer: `当前记录显示重点方向包括 ${company.vehicleDirections.slice(0, 5).join("、")}。建议围绕这些方向准备简历项目、专业基础和面试复盘。`,
    },
    {
      question: "页面信息可以直接作为最终投递依据吗？",
      answer: "不可以。平台用于聚合和提醒，最终批次、岗位和时间以企业官方招聘站或学校就业网通知为准。",
    },
  ];
  const groupedJobs = JOB_GROUPS.map((direction) => ({
    direction,
    jobs: company.jobs.filter((job) => job.direction === direction),
  })).filter((group) => group.jobs.length > 0);
  const otherJobs = company.jobs.filter((job) => !JOB_GROUPS.includes(job.direction as (typeof JOB_GROUPS)[number]));

  return (
    <div className="detail-page">
      <section className="detail-hero">
        <div className="shell">
          <Link className="back-link" href="/companies"><ArrowLeft size={16} />返回公司库</Link>
          <div className="detail-title-row">
            <div className="detail-monogram">{company.logo || company.shortName.slice(0, 1)}</div>
            <div className="detail-title">
              <div className="tag-row">
                <span className="tag">{company.type}</span>
                <StatusBadge status={program?.status ?? company.status} />
                <span className="tag">{company.dataStatus}</span>
              </div>
              <h1>{company.name} 2027届校招跟踪</h1>
              <p>{company.description}</p>
              <p className="detail-verify">
                内容更新：{new Date(company.lastUpdatedAt).toLocaleDateString("zh-CN")}
                {" · "}
                最后核验：{company.verifiedAt ? new Date(company.verifiedAt).toLocaleDateString("zh-CN") : "待补充"}
                {" · "}
                信息可信度：{program?.credibility ?? "待核实"}
              </p>
            </div>
            <div className="detail-actions">
              <ExternalLink href={program?.applyUrl ?? company.campusRecruitmentWebsite} className="button button-accent" emptyLabel="待补官方链接">官方投递入口</ExternalLink>
              <ExternalLink href={company.officialWebsite} emptyLabel="公司官网待补">公司官网</ExternalLink>
            </div>
          </div>
        </div>
      </section>

      <div className="shell detail-layout">
        <div className="detail-main">
          <DetailSection title="公司基础信息" icon={Building2}>
            <div className="info-grid">
              <Info label="主要城市" value={company.cities.join(" / ")} icon={MapPin} />
              <Info label="企业类型" value={company.type} icon={Building2} />
              <Info label="数据核验状态" value={company.dataStatus} icon={ShieldCheck} />
              <Info label="车辆方向" value={company.vehicleDirections.join(" · ")} icon={Route} />
            </div>
          </DetailSection>

          <DetailSection title="信息可信度说明" icon={ShieldCheck}>
            <div className="credibility-panel">
              <p><strong>官方：</strong>来自企业招聘站、官网或官方账号，并保留来源链接。</p>
              <p><strong>较可信：</strong>来自学校就业网、企业公开页面或多渠道一致信息。</p>
              <p><strong>经验参考：</strong>来自候选人复盘，仅用于准备方向，不代表企业题库。</p>
              <p><strong>待核实：</strong>缺少来源或投递入口，页面会显示待补充，不作为最终投递依据。</p>
            </div>
          </DetailSection>

          <DetailSection title="2027届校招项目" icon={CalendarDays}>
            <div className="stack-list">
              {company.recruitments.map((item) => (
                <article className="recruitment-card" key={item.id}>
                  <div><p className="eyebrow">{item.targetYear}届 / {item.batch}</p><h3>{item.title}</h3></div>
                  <StatusBadge status={item.status} />
                  <div className="timeline-meta">
                    <span>开始：{item.dateConfidence === "VERIFIED" && item.startDate ? new Date(item.startDate).toLocaleDateString("zh-CN") : "日期待确认"}</span>
                    <span>截止：{item.dateConfidence === "VERIFIED" && item.endDate ? new Date(item.endDate).toLocaleDateString("zh-CN") : "日期待确认"}</span>
                    <span>来源：{sourceTypeLabel(item.sourceType)}</span>
                    <span>可信度：{item.credibility}</span>
                    <span>最后核验：{item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString("zh-CN") : "待补充"}</span>
                  </div>
                  <p className="process-line"><Route size={16} />{item.process}</p>
                  {item.notes && <p className="program-note">{item.notes}</p>}
                  <div className="inline-actions">
                    <ExternalLink href={item.applyUrl} className="button button-accent" emptyLabel="待补充">申请入口</ExternalLink>
                    <ExternalLink href={item.sourceUrl} emptyLabel="来源待补">来源链接</ExternalLink>
                    <Link href="/about#feedback" className="button button-secondary"><MessageSquareWarning size={15} />反馈纠错</Link>
                  </div>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="岗位方向分组" icon={BriefcaseBusiness}>
            <div className="relevance-note">
              <strong>车辆方向相关度参考</strong>
              <p>依据岗位方向、专业关键词和技能标签分为高相关、中相关、低相关。仅为平台规则参考，不代表录用概率。</p>
            </div>
            <div className="job-group-list">
              {[...groupedJobs, ...(otherJobs.length ? [{ direction: "其他方向", jobs: otherJobs }] : [])].map((group) => (
                <section className="job-group" key={group.direction}>
                  <h3>{group.direction}</h3>
                  <div className="job-list">
                    {group.jobs.map((job) => {
                      const relevance = vehicleRelevance(job);
                      return (
                        <article className="job-card" key={job.id}>
                          <div className="job-score">
                            <strong className={relevance.className}>{relevance.level}</strong>
                            <span>方向参考</span>
                          </div>
                          <div>
                            <p className="eyebrow">{job.city} · {job.education}</p>
                            <h3>{job.sourceType === "UNKNOWN" ? `方向参考：${job.direction}` : job.title}</h3>
                            <p>{job.majors.join(" / ") || job.majorRequirement}</p>
                            <small>{job.skills.join(" · ")}</small>
                            <div className="job-reasons">
                              {relevance.reasons.map((reason) => <span key={reason}>{reason}</span>)}
                            </div>
                          </div>
                          <ExternalLink href={job.applyUrl} emptyLabel="待补充">岗位投递</ExternalLink>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="笔试面经资料" icon={FileText}>
            <div className="resource-grid detail-resources">
              {company.resources.map((resource) => (
                <article className="resource-card" key={resource.id}>
                  <div className="resource-heading"><span className="tag">{resource.type}</span><span className="credibility">{resource.credibility}</span></div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <div className="tag-row">{resource.tags.slice(0, 4).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                  <small>{resource.targetYear}届 · 来源年份 {resource.sourceYear} · {sourceTypeLabel(resource.sourceType)}</small>
                  <ExternalLink href={resource.sourceUrl} emptyLabel="暂无链接，待补充">查看资料</ExternalLink>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="校招 FAQ" icon={HelpCircle}>
            <div className="faq-list">
              {faqItems.map((item) => (
                <article className="faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
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
            <p>结合企业标签与岗位方向生成，适合用于简历项目复盘和面试准备：</p>
            <div className="advice-list">{advice.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <div className="notice-card">
            <strong>投递前确认</strong>
            <p>校招批次、岗位城市和截止时间可能动态变化，请以企业官方招聘站或学校就业网最终通知为准。</p>
            <Link href="/about#feedback" className="text-link">反馈纠错</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }: { title: string; icon: typeof Building2; children: ReactNode }) {
  return <section className="detail-section"><div className="detail-section-title"><Icon size={20} /><h2>{title}</h2></div>{children}</section>;
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Building2 }) {
  return <div className="info-item"><Icon size={18} /><div><span>{label}</span><strong>{value || "待确认"}</strong></div></div>;
}
