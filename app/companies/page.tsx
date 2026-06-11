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
          <p>招聘官网、2027 项目证据和核验状态分开记录。官网存在不代表当前批次已经开放。</p>
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
            sort: first(params.sort) || "updated",
          }}
        />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
