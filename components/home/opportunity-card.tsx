import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CompanyLinkAction } from "@/components/company/company-link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CompanyCardData, CompanyLinkData, RecruitmentData } from "@/lib/data";

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
}: {
  company: CompanyCardData;
  program: RecruitmentData & { sourceLink?: CompanyLinkData | null };
}) {
  return (
    <article className="opportunity-card" data-testid="home-opportunity">
      <div className="opportunity-card-top">
        <span className="company-avatar">{company.shortName.slice(0, 1)}</span>
        <StatusBadge status="正在招聘" />
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
      <strong className="opportunity-title">{program.title}</strong>
      <div className="chip-list">
        {company.vehicleDirections.slice(0, 3).map((direction) => (
          <span key={direction}>{direction}</span>
        ))}
      </div>
      <div className="opportunity-card-footer">
        <CompanyLinkAction
          companyName={company.name}
          link={program.sourceLink}
          className="text-link"
        />
        <small>{formatDate(program.verifiedAt)} 核验</small>
      </div>
      <Link className="card-cover-link" href={`/companies/${company.slug}`}>
        <span className="sr-only">了解{company.name}机会</span>
        <ArrowRight size={18} />
      </Link>
    </article>
  );
}
