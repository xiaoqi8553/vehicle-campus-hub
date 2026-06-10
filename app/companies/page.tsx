import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";

export default async function CompaniesPage() {
  try {
    const companies = await getCompanies();
    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">2027 COMPANY DATABASE / {companies.length} RECORDS</p>
          <h1>2027届车辆行业公司库</h1>
          <p>按公司类型、校招状态、车辆方向、城市、可信度和官方链接完整筛选。没有官方投递入口的企业会明确显示“待补官方链接”。</p>
        </div>
        <CompanyExplorer companies={companies} showSort />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
