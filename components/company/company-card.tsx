import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MapPin } from "lucide-react";
import type { CompanyCardData } from "@/lib/data";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";

function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value))
    : "待补充";
}

export function CompanyCard({ company }: { company: CompanyCardData }) {
  const program = company.recruitments?.find((item) => item.targetYear === 2027);
  const recruitmentUrl = program?.applyUrl ?? company.recruitmentWebsite;

  return (
    <article className="company-row" data-testid="company-row">
      <div className="company-identity">
        <span className="company-index">{company.shortName.slice(0, 1)}</span>
        <div>
          <p>{company.type}</p>
          <h2>{company.name}</h2>
        </div>
      </div>
      <div className="company-status">
        <StatusBadge status={program?.status ?? company.status} />
        <span className={`evidence-state evidence-${company.dataStatus === "入口可用" ? "ok" : "pending"}`}>
          <CheckCircle2 size={14} />{company.dataStatus}
        </span>
      </div>
      <div className="company-facts">
        <span><MapPin size={14} />{company.cities.join(" / ")}</span>
        <span>{company.vehicleDirections.slice(0, 3).join(" · ")}</span>
      </div>
      <div className="company-evidence">
        <span>最后核验</span>
        <strong>{formatDate(company.verifiedAt)}</strong>
      </div>
      <div className="company-row-actions">
        <ExternalLink href={recruitmentUrl} emptyLabel="招聘入口待复核">招聘官网</ExternalLink>
        <Link href={`/companies/${company.slug}`} className="row-link" aria-label="查看公司档案">
          查看档案<ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
