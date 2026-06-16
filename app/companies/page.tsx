import { Building2, CheckCircle2 } from "lucide-react";
import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { PageHero } from "@/components/ui/page-hero";
import { getCompanies } from "@/lib/data";
import { isCohortEvidence, isUsableLinkEvidence } from "@/lib/domain";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  try {
    const companies = await getCompanies();
    const params = await searchParams;
    const openCount = companies.filter(
      (company) =>
        company.recruitments?.some(
          (item) => item.targetYear === 2027 && item.status.includes("开放"),
        ) && company.links?.some((link) => isCohortEvidence(link, 2027)),
    ).length;
    const linkCount = companies.filter((company) =>
      company.links?.some((link) => link.isPrimary && isUsableLinkEvidence(link)),
    ).length;

    return (
      <div className="shell page-space">
        <PageHero
          eyebrow="公司机会"
          title="车辆行业 2027 届公司机会库"
          description="按车辆方向、公司类型和招聘入口状态筛选。明确开放的 2027 届项目优先展示，通用招聘入口不会被当作已开放项目。"
          aside={
            <div className="page-stat-pills">
              <span>
                <Building2 size={16} />
                {companies.length} 家企业
              </span>
              <span>
                <CheckCircle2 size={16} />
                {openCount} 个明确项目
              </span>
              <span>{linkCount} 个可用入口</span>
            </div>
          }
        />
        <CompanyExplorer
          companies={companies}
          showSort
          initialFilters={{
            query: first(params.q),
            category: first(params.type),
            status: first(params.status),
            direction: first(params.direction),
            city: first(params.city),
            hasOfficialLink: first(params.official),
            sort: first(params.sort) || "opportunity",
          }}
        />
      </div>
    );
  } catch {
    return (
      <div className="shell page-space">
        <DataState />
      </div>
    );
  }
}
