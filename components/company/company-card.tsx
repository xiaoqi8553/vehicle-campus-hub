import { ArrowRight, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { CompanyLinkAction } from "@/components/company/company-link";
import { CompanyLogo } from "@/components/company/company-logo";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CompanyCardData } from "@/lib/data";
import {
  externalDomain,
  isCohortEvidence,
  isUsableLinkEvidence,
  linkHealthLabel,
  linkSourceTypeLabel,
} from "@/lib/domain";

function formatDate(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "待人工确认";
}

export function CompanyCard({ company }: { company: CompanyCardData }) {
  const links = company.links ?? [];
  const primaryLink = links.find((link) => link.isPrimary && isUsableLinkEvidence(link));
  const program = company.recruitments?.find(
    (item) =>
      item.targetYear === 2027 && item.sourceLink && isCohortEvidence(item.sourceLink, 2027),
  );
  const publicStatus = program ? "2027 项目已开放" : primaryLink ? "等待 2027 项目" : "信息待确认";

  return (
    <article className="company-list-item" data-testid="company-row">
      <div className="company-list-identity">
        <CompanyLogo name={company.name} logo={company.logo} />
        <div>
          <span className="company-type">{company.type}</span>
          <h2>
            <a href={`/companies/${company.slug}`}>{company.name}</a>
          </h2>
          <p>
            <MapPin size={14} />
            {company.cities.slice(0, 3).join(" / ")}
          </p>
        </div>
      </div>

      <div className="company-list-opportunity">
        <StatusBadge status={publicStatus} />
        <strong>{program?.title ?? "关注企业后续校园招聘更新"}</strong>
        <div className="chip-list">
          {company.vehicleDirections.slice(0, 3).map((direction) => (
            <span key={direction}>{direction}</span>
          ))}
        </div>
      </div>

      <div className="company-list-source">
        <span>
          <ShieldCheck size={15} />
          {primaryLink ? linkSourceTypeLabel(primaryLink.sourceType) : "入口待补充"}
        </span>
        <strong>{primaryLink ? externalDomain(primaryLink.url) : "暂无有效官方域名"}</strong>
        <small>
          <CalendarDays size={14} />
          {primaryLink
            ? `${linkHealthLabel(primaryLink.healthStatus)} · ${formatDate(primaryLink.verifiedAt)} 核验`
            : "等待人工核验"}
        </small>
      </div>

      <div className="company-list-actions">
        <CompanyLinkAction companyName={company.name} link={primaryLink} />
        <a
          href={`/companies/${company.slug}`}
          className="detail-link"
          aria-label={`了解${company.name}机会`}
        >
          了解公司机会
          <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}
