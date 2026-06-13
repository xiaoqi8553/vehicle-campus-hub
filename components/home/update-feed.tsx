import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CompanyCardData } from "@/lib/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function UpdateFeed({ companies }: { companies: CompanyCardData[] }) {
  return (
    <div className="update-feed">
      {companies.map((company) => (
        <Link
          href={`/companies/${company.slug}`}
          className="update-feed-item"
          data-testid="latest-update"
          key={company.id}
        >
          <span className="company-avatar company-avatar-small">
            {company.shortName.slice(0, 1)}
          </span>
          <span>
            <strong>{company.name}</strong>
            <small>{company.changeSummary}</small>
          </span>
          <time dateTime={company.lastUpdatedAt}>{formatDate(company.lastUpdatedAt)}</time>
          <ArrowRight size={16} />
        </Link>
      ))}
    </div>
  );
}
