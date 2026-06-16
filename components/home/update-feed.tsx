import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompanyLogo } from "@/components/company/company-logo";
import type { CompanyCardData } from "@/lib/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function UpdateFeed({ companies }: { companies: CompanyCardData[] }) {
  const summaries: Record<string, string> = {
    byd: "实习生招聘入口已核验，面向 2026/2027 届；可进入官方入口查看岗位。",
    xpeng: "2027 暑期实习项目入口可访问；可直接核对岗位和投递要求。",
    "xiaomi-auto": "校园招聘入口已核验，需继续确认具体岗位和截止时间。",
    bosch: "官方招聘入口已核验，暂未发现 2027 届具体项目。",
    zf: "全球招聘入口已核验，暂未发现 2027 届具体项目。",
  };

  return (
    <div className="update-feed">
      {companies.map((company) => (
        <Link
          href={`/companies/${company.slug}`}
          className="update-feed-item"
          data-testid="latest-update"
          key={company.id}
        >
          <CompanyLogo name={company.name} logo={company.logo} size="sm" />
          <span>
            <strong>{company.name}</strong>
            <small>{summaries[company.id] ?? company.changeSummary}</small>
          </span>
          <time dateTime={company.lastUpdatedAt}>{formatDate(company.lastUpdatedAt)}</time>
          <ArrowRight size={16} />
        </Link>
      ))}
    </div>
  );
}
