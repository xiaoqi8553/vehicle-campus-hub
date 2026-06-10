import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import type { CompanyCardData } from "@/lib/data";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";

function formatDate(value: string | null | undefined) {
  if (!value) return "待确认";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function CompanyCard({ company }: { company: CompanyCardData }) {
  const program = company.recruitments?.find((item) => item.targetYear === 2027) ?? company.recruitments?.[0];
  const status = program?.status ?? company.status;
  const applyUrl = program?.applyUrl ?? company.campusRecruitmentWebsite;

  return (
    <article className="company-card" data-testid="company-card">
      <div className="company-card-top">
        <span className="company-monogram">{company.logo || company.shortName.slice(0, 1)}</span>
        <div>
          <p className="eyebrow">{company.type}</p>
          <h3>{company.name}</h3>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="company-meta">
        <span><MapPin size={14} />{company.cities.join(" / ") || "城市待确认"}</span>
        <span><CalendarDays size={14} />{formatDate(program?.startDate)} 开始 / {formatDate(program?.endDate)} 截止</span>
        <span><CheckCircle2 size={14} />{company.dataStatus}</span>
      </div>
      <div className="tag-row">
        {company.vehicleDirections.slice(0, 4).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div>
        <p className="mini-label">2027届信息状态</p>
        <p className="direction-copy">
          {program?.credibility ?? "待核实"} · {program?.sourceType ?? "公开整理"} · 更新于 {formatFullDate(company.lastUpdatedAt)}
        </p>
      </div>
      <div className="company-actions">
        <ExternalLink href={applyUrl} className="button button-accent" emptyLabel="待补官方链接">
          官方投递
        </ExternalLink>
        <Link href={`/companies/${company.slug}`} className="button button-primary">
          查看详情<ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
