import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  try {
    const companies = await getCompanies();
    const params = await searchParams;
    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">2027 COMPANY DATABASE / {companies.length} RECORDS</p>
          <h1>2027届车辆行业公司库</h1>
          <p>按公司类型、校招状态、车辆方向、城市、可信度和官方链接完整筛选。没有官方投递入口的企业会明确显示“待补官方链接”。</p>
        </div>
        <CompanyExplorer
          companies={companies}
          showSort
          initialFilters={{
            query: first(params.q),
            category: first(params.type),
            status: first(params.status),
            direction: first(params.direction),
            city: first(params.city),
            credibility: first(params.credibility),
            hasOfficialLink: first(params.official),
            sort: first(params.sort) || "updated",
          }}
        />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
