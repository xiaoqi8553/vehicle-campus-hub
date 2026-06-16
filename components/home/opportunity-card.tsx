import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { CompanyLinkAction } from "@/components/company/company-link";
import { CompanyLogo } from "@/components/company/company-logo";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CompanyCardData, CompanyLinkData, RecruitmentData } from "@/lib/data";
import { isCohortEvidence, isUsableLinkEvidence, linkSourceTypeLabel } from "@/lib/domain";

function formatDate(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "待人工确认";
}

export function OpportunityCard({
  company,
  program,
  variant = "verified",
}: {
  company: CompanyCardData;
  program?: (RecruitmentData & { sourceLink?: CompanyLinkData | null }) | null;
  variant?: "open" | "verified" | "watch";
}) {
  const links = company.links ?? [];
  const primaryLink =
    program?.sourceLink ??
    links.find((link) => link.isPrimary && isUsableLinkEvidence(link)) ??
    links.find((link) => isUsableLinkEvidence(link));
  const hasCohortProject = primaryLink ? isCohortEvidence(primaryLink, 2027) : false;
  const status =
    variant === "open" && hasCohortProject
      ? "正在招聘"
      : variant === "verified"
        ? "入口已核验"
        : "等待 2027 项目";
  const opportunityTitle =
    program?.title ?? (variant === "verified" ? "官方招聘入口已核验" : "关注后续校园招聘发布");

  return (
    <article className={`opportunity-card opportunity-${variant}`} data-testid="home-opportunity">
      <div className="opportunity-card-top">
        <CompanyLogo name={company.name} logo={company.logo} />
        <StatusBadge status={status} />
      </div>
      <div>
        <h3>{company.name}</h3>
        <p className="company-meta">
          {company.type}
          <span>
            <MapPin size={14} />
            {company.cities.slice(0, 2).join(" / ")}
          </span>
        </p>
      </div>
      <strong className="opportunity-title">{opportunityTitle}</strong>
      <p className="opportunity-source">
        <ShieldCheck size={15} />
        {primaryLink ? linkSourceTypeLabel(primaryLink.sourceType) : "入口待补充"}
      </p>
      <div className="chip-list">
        {company.vehicleDirections.slice(0, 3).map((direction) => (
          <span key={direction}>{direction}</span>
        ))}
      </div>
      <div className="opportunity-card-footer">
        <CompanyLinkAction companyName={company.name} link={primaryLink} className="text-link" />
        <small>
          <CalendarDays size={14} />
          {formatDate(primaryLink?.verifiedAt ?? program?.verifiedAt)} 核验
        </small>
      </div>
      <Link className="card-cover-link" href={`/companies/${company.slug}`}>
        <span className="sr-only">了解{company.name}机会</span>
        <ArrowRight size={18} />
      </Link>
    </article>
  );
}
