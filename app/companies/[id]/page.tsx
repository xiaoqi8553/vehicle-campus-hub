import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  ExternalLinkIcon,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { CompanyLinkAction, LinkEvidenceRow } from "@/components/company/company-link";
import { FeedbackCallout } from "@/components/ui/feedback-callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCompanyDetail } from "@/lib/data";
import {
  isCohortEvidence,
  isUsableLinkEvidence,
  linkHealthLabel,
  linkSourceTypeLabel,
} from "@/lib/domain";

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

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyDetail(id);
  if (!company) notFound();

  const links = company.links ?? [];
  const primaryLink = links.find((link) => link.isPrimary && isUsableLinkEvidence(link));
  const otherLinks = links.filter((link) => link.id !== primaryLink?.id);
  const program = company.recruitments.find(
    (item) =>
      item.targetYear === 2027 && item.sourceLink && isCohortEvidence(item.sourceLink, 2027),
  );
  const currentStatus = program ? "2027 项目已开放" : primaryLink ? "等待 2027 项目" : "信息待确认";

  return (
    <div className="shell page-space company-detail-page">
      <Link className="back-link" href="/companies">
        <ArrowLeft size={16} />
        返回公司机会
      </Link>

      <header className="company-detail-hero">
        <div className="company-detail-brand">
          <span className="company-avatar company-avatar-large">
            {company.shortName.slice(0, 1)}
          </span>
          <div>
            <p className="page-kicker">{company.type}</p>
            <h1>{company.name}</h1>
            <p>{company.description}</p>
          </div>
        </div>
        <div className="company-detail-meta">
          <StatusBadge status={currentStatus} />
          <span>
            <MapPin size={15} />
            {company.cities.join(" / ")}
          </span>
          <span>
            <ShieldCheck size={15} />
            最后核验 {formatDate(primaryLink?.verifiedAt ?? company.verifiedAt)}
          </span>
        </div>
        <CompanyLinkAction companyName={company.name} link={primaryLink} />
      </header>

      <div className="company-detail-layout">
        <main className="company-detail-main">
          <section className="content-section">
            <div className="content-section-heading">
              <CalendarDays size={20} />
              <div>
                <p className="page-kicker">2027 届</p>
                <h2>当前校招机会</h2>
              </div>
            </div>
            {program ? (
              <article className="program-card">
                <div className="program-card-top">
                  <div>
                    <span>{program.batch}</span>
                    <h3>{program.title}</h3>
                  </div>
                  <StatusBadge status={program.status} />
                </div>
                <p>{program.notes || "项目具体安排以官方页面为准。"}</p>
                <dl>
                  <div>
                    <dt>开始时间</dt>
                    <dd>{program.startDate ? formatDate(program.startDate) : "官方未公布"}</dd>
                  </div>
                  <div>
                    <dt>截止时间</dt>
                    <dd>{program.endDate ? formatDate(program.endDate) : "官方未公布"}</dd>
                  </div>
                  <div>
                    <dt>招聘流程</dt>
                    <dd>{program.process || "以官方项目说明为准"}</dd>
                  </div>
                  <div>
                    <dt>最后核验</dt>
                    <dd>{formatDate(program.verifiedAt)}</dd>
                  </div>
                </dl>
                <div className="program-source-line">
                  <ShieldCheck size={16} />
                  <span>
                    {program.sourceLink
                      ? `${linkSourceTypeLabel(program.sourceLink.sourceType)} · ${linkHealthLabel(program.sourceLink.healthStatus)}`
                      : "来源待补充"}
                  </span>
                </div>
              </article>
            ) : (
              <div className="empty-opportunity">
                <span>
                  <CalendarDays size={22} />
                </span>
                <div>
                  <strong>尚未发现明确的 2027 届官方项目</strong>
                  <p>
                    招聘门户仍可用于观察，但它不代表 2027
                    届项目已经开放。我们会在发现官方项目后更新。
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="content-section">
            <div className="content-section-heading">
              <BriefcaseBusiness size={20} />
              <div>
                <p className="page-kicker">方向参考</p>
                <h2>适合关注的技术方向</h2>
              </div>
            </div>
            <p className="section-description">
              这些方向来自企业公开业务分类，用于帮助你选择准备重点，不代表当前一定存在对应岗位。
            </p>
            <div className="direction-chip-grid">
              {company.vehicleDirections.map((direction) => (
                <span key={direction}>
                  <CheckCircle2 size={16} />
                  {direction}
                </span>
              ))}
            </div>
            <p className="relevance-disclaimer">
              车辆方向相关度参考综合专业相关度、车辆工程关键词、技能匹配和岗位方向；仅为平台规则参考，不代表录用概率。
            </p>
          </section>

          <section className="content-section">
            <div className="content-section-heading">
              <ExternalLinkIcon size={20} />
              <div>
                <p className="page-kicker">官方来源</p>
                <h2>官方来源与核验记录</h2>
              </div>
            </div>
            {primaryLink ? (
              <div className="primary-source-summary">
                <span>{linkSourceTypeLabel(primaryLink.sourceType)}</span>
                <strong>{primaryLink.title}</strong>
                <p>{primaryLink.evidenceSummary}</p>
                <small>
                  {linkHealthLabel(primaryLink.healthStatus)} · {formatDate(primaryLink.verifiedAt)}{" "}
                  核验
                </small>
              </div>
            ) : null}
            <div className="source-list detail-source-list">
              {otherLinks.map((link) => (
                <LinkEvidenceRow companyName={company.name} key={link.id} link={link} />
              ))}
            </div>
          </section>

          <section className="content-section">
            <div className="content-section-heading">
              <CircleHelp size={20} />
              <div>
                <p className="page-kicker">常见问题</p>
                <h2>投递前需要知道什么？</h2>
              </div>
            </div>
            <div className="faq-list">
              <details>
                <summary>招聘门户存在，是否代表 2027 届已经开放？</summary>
                <p>不是。只有官方页面明确写明 2027 届项目、实习或届次要求时，才会计入开放项目。</p>
              </details>
              <details>
                <summary>为什么没有显示截止日期？</summary>
                <p>当前来源没有公布可核验的截止时间，平台不会用往届时间代替。</p>
              </details>
              <details>
                <summary>链接打不开怎么办？</summary>
                <p>先查看链接状态。被反爬拦截不等于链接失效；已经失效的链接不会提供点击入口。</p>
              </details>
            </div>
          </section>
        </main>

        <aside className="company-detail-aside">
          <section className="quick-answer">
            <p className="page-kicker">快速判断</p>
            <h2>现在可以做什么？</h2>
            <ul>
              <li>
                <CheckCircle2 size={17} />
                <span>
                  <strong>2027 项目</strong>
                  {program ? "已有明确官方信息，可以查看项目页面。" : "暂未发布，先加入关注清单。"}
                </span>
              </li>
              <li>
                <Building2 size={17} />
                <span>
                  <strong>招聘入口</strong>
                  {primaryLink ? "当前主入口可使用。" : "暂无可用主入口，等待补充。"}
                </span>
              </li>
              <li>
                <CalendarDays size={17} />
                <span>
                  <strong>时间安排</strong>
                  {program?.endDate
                    ? `截止 ${formatDate(program.endDate)}。`
                    : "截止日期尚未公布。"}
                </span>
              </li>
            </ul>
            <Link href="/resources">
              查看求职准备指南
              <ArrowRight size={16} />
            </Link>
          </section>
          <FeedbackCallout companyName={company.name} />
        </aside>
      </div>
    </div>
  );
}
