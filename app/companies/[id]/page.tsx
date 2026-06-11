import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleHelp,
  ExternalLinkIcon,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { CompanyLinkAction, LinkEvidenceRow } from "@/components/company/company-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCompanyDetail } from "@/lib/data";
import { isCohortEvidence, isUsableLinkEvidence } from "@/lib/domain";

const FEEDBACK_URL = "https://github.com/xiaoqi8553/vehicle-campus-hub/issues/new?template=data-correction.md";

function date(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value))
    : "待人工确认";
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyDetail(id);
  if (!company) notFound();

  const links = company.links ?? [];
  const primaryLink = links.find((link) => link.isPrimary && isUsableLinkEvidence(link));
  const otherLinks = links.filter((link) => link.id !== primaryLink?.id);
  const program = company.recruitments.find((item) =>
    item.targetYear === 2027
    && item.sourceLink
    && isCohortEvidence(item.sourceLink, 2027),
  );

  return (
    <div className="shell page-space detail-page">
      <Link className="back-link" href="/companies"><ArrowLeft size={16} />返回公司情报库</Link>
      <header className="company-dossier">
        <div className="dossier-mark">{company.shortName.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">{company.type} / EVIDENCE DOSSIER</p>
          <h1>{company.name}</h1>
          <p>{company.description}</p>
          <div className="dossier-badges">
            <StatusBadge status={program?.status ?? "2027 待官方发布"} />
            <span>{company.dataStatus}</span>
            <span>最后核验 {date(primaryLink?.verifiedAt ?? company.verifiedAt)}</span>
          </div>
        </div>
        <div className="dossier-actions">
          <CompanyLinkAction companyName={company.name} link={primaryLink} />
        </div>
      </header>

      <div className="detail-layout">
        <main className="detail-main">
          <section className="detail-section">
            <div className="detail-section-title"><Building2 size={20} /><h2>公司与核验概况</h2></div>
            <div className="info-grid">
              <div><MapPin size={17} /><span>主要城市</span><strong>{company.cities.join(" / ")}</strong></div>
              <div><BriefcaseBusiness size={17} /><span>企业类型</span><strong>{company.type}</strong></div>
              <div><ShieldCheck size={17} /><span>入口状态</span><strong>{company.dataStatus}</strong></div>
              <div><CalendarDays size={17} /><span>内容更新</span><strong>{date(company.lastUpdatedAt)}</strong></div>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><CalendarDays size={20} /><h2>2027 届项目判断</h2></div>
            {program ? (
              <article className="official-program">
                <div>
                  <p className="eyebrow">{program.targetYear}届 / {program.batch}</p>
                  <h3>{program.title}</h3>
                  <p>{program.notes}</p>
                </div>
                <StatusBadge status={program.status} />
                <dl>
                  <div><dt>开始时间</dt><dd>官方未公布</dd></div>
                  <div><dt>截止时间</dt><dd>官方未公布</dd></div>
                  <div><dt>项目流程</dt><dd>{program.process}</dd></div>
                  <div><dt>核验时间</dt><dd>{date(program.verifiedAt)}</dd></div>
                </dl>
                <p className="program-link-note">项目申请与证据指向同一官方页面，已合并为页面顶部唯一主入口。</p>
              </article>
            ) : (
              <div className="data-state">
                <strong>尚未发现明确的 2027 届官方项目</strong>
                <p>通用招聘网站或校园门户仍可用于观察，但不会据此推断 2027 届项目已经开放。</p>
              </div>
            )}
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><ExternalLinkIcon size={20} /><h2>更多来源与证据</h2></div>
            <div className="source-list detail-source-list">
              {otherLinks.map((link) => (
                <LinkEvidenceRow companyName={company.name} key={link.id} link={link} />
              ))}
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><BriefcaseBusiness size={20} /><h2>岗位方向参考</h2></div>
            <p className="section-note">以下方向来自企业公开业务分类，用于准备方向选择，不代表当前存在对应岗位或录用概率。</p>
            <div className="direction-matrix">
              {company.vehicleDirections.map((direction, index) => (
                <span key={direction}><i>{String(index + 1).padStart(2, "0")}</i>{direction}</span>
              ))}
            </div>
            <p className="relevance-note">相关度依据：企业业务方向、车辆工程关键词和公开技术领域。平台不展示无法解释的精确匹配分数。</p>
          </section>

          <section className="detail-section">
            <div className="detail-section-title"><CircleHelp size={20} /><h2>常见问题</h2></div>
            <div className="faq-list">
              <details><summary>招聘门户存在，是否代表 2027 届已开放？</summary><p>不是。只有页面明确写明 2027 届项目、实习或届次要求时，才会计入开放项目。</p></details>
              <details><summary>为什么没有显示截止日期？</summary><p>当前来源未公布可核验的截止时间。平台不会用 seed 日期或往届时间代替。</p></details>
              <details><summary>链接打不开怎么办？</summary><p>先查看健康状态。反爬拦截不等于链接失效；已失效链接则不会提供点击入口。</p></details>
            </div>
          </section>
        </main>

        <aside className="detail-aside">
          <section className="source-ledger">
            <p className="eyebrow">DECISION SUMMARY</p>
            <h2>下一步判断</h2>
            <dl>
              <div><dt>2027 项目</dt><dd>{program ? "有明确证据" : "尚未发布"}</dd></div>
              <div><dt>主入口</dt><dd>{primaryLink ? "可使用" : "需人工复核"}</dd></div>
              <div><dt>精确日期</dt><dd>未公布</dd></div>
              <div><dt>具体岗位</dt><dd>{company.jobs.length ? `${company.jobs.length} 条` : "未核验"}</dd></div>
            </dl>
          </section>
          <section className="notice-card">
            <strong>发现链接或届次有误？</strong>
            <p>提交公司名、正确链接、证据摘要和核验日期，维护者可以直接复核。</p>
            <a aria-label={`打开 GitHub 提交${company.name}纠错反馈`} href={FEEDBACK_URL} target="_blank" rel="noreferrer">提交纠错反馈<ArrowRight size={15} /></a>
          </section>
        </aside>
      </div>
    </div>
  );
}
