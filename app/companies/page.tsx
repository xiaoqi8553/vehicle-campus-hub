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
          <p className="eyebrow">COMPANY INTELLIGENCE / {companies.length} RECORDS</p>
          <h1>2027届车辆行业公司情报库</h1>
          <p>默认按明确开放项目、最近核验时间和公司名排序。每行只保留一个主入口，其余证据收进来源列表。</p>
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
            hasOfficialLink: first(params.official),
            sort: first(params.sort) || "opportunity",
          }}
        />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
