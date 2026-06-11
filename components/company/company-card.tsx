import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { CompanyLinkAction, LinkEvidenceRow } from "@/components/company/company-link";
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
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value))
    : "待人工确认";
}

export function CompanyCard({ company }: { company: CompanyCardData }) {
  const links = company.links ?? [];
  const primaryLink = links.find((link) => link.isPrimary && isUsableLinkEvidence(link));
  const program = company.recruitments?.find(
    (item) =>
      item.targetYear === 2027 && item.sourceLink && isCohortEvidence(item.sourceLink, 2027),
  );
  const otherLinks = links.filter((link) => link.id !== primaryLink?.id);

  return (
    <article className="company-row" data-testid="company-row">
      <div className="company-identity">
        <span className="company-index">{company.shortName.slice(0, 1)}</span>
        <div>
          <p>{company.type}</p>
          <h2>
            <Link href={`/companies/${company.slug}`}>{company.name}</Link>
          </h2>
          <span className="company-city">
            <MapPin size={14} />
            {company.cities.join(" / ")}
          </span>
        </div>
      </div>

      <div className="company-status">
        <StatusBadge status={program?.status ?? "2027 待官方发布"} />
        <span>{company.vehicleDirections.slice(0, 3).join(" · ")}</span>
      </div>

      <div className="company-link-facts">
        <strong>
          {primaryLink ? linkSourceTypeLabel(primaryLink.sourceType) : "暂无可用主入口"}
        </strong>
        <span>{primaryLink ? externalDomain(primaryLink.url) : "链接需人工复核"}</span>
        <span>面向 {primaryLink?.targetCohort ?? "未明确"}</span>
        <small>
          {primaryLink ? linkHealthLabel(primaryLink.healthStatus) : "待人工确认"} ·{" "}
          {formatDate(primaryLink?.verifiedAt)}
        </small>
      </div>

      <div className="company-row-actions">
        <CompanyLinkAction companyName={company.name} link={primaryLink} />
        <Link
          href={`/companies/${company.slug}`}
          className="row-link"
          aria-label={`查看${company.name}证据档案`}
        >
          查看证据档案
          <ArrowRight size={15} />
        </Link>
      </div>

      {otherLinks.length > 0 && (
        <details className="more-sources">
          <summary>
            <ChevronDown size={15} />
            更多来源（{otherLinks.length}）
          </summary>
          <div className="source-list">
            {otherLinks.map((link) => (
              <LinkEvidenceRow companyName={company.name} key={link.id} link={link} />
            ))}
          </div>
        </details>
      )}
    </article>
  );
}
