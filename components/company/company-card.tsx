import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import type { CompanyCardData } from "@/lib/data";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";

export function CompanyCard({ company }: { company: CompanyCardData }) {
  return (
    <article className="company-card" data-testid="company-card">
      <div className="company-card-top">
        <span className="company-monogram">{company.name.slice(0, 1)}</span>
        <div>
          <p className="eyebrow">{company.category}</p>
          <h3>{company.name}</h3>
        </div>
        <StatusBadge status={company.status} />
      </div>
      <div className="company-meta">
        <span><MapPin size={14} />{company.cities.join(" / ") || "城市待确认"}</span>
        <span><Building2 size={14} />更新于 {new Date(company.lastUpdatedAt).toLocaleDateString("zh-CN")}</span>
      </div>
      <div className="tag-row">
        {company.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div>
        <p className="mini-label">车辆方向适配</p>
        <p className="direction-copy">{company.fitDirections.slice(0, 4).join(" · ")}</p>
      </div>
      <div className="company-actions">
        <Link href={`/companies/${company.id}`} className="button button-primary">
          查看详情<ArrowRight size={15} />
        </Link>
        <ExternalLink href={company.campusUrl}>官网投递</ExternalLink>
      </div>
    </article>
  );
}
