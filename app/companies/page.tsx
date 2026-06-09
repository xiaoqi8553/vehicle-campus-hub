import { CompanyExplorer } from "@/components/company/company-explorer";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";

export default async function CompaniesPage() {
  try {
    const companies = await getCompanies();
    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">COMPANY DATABASE / {companies.length} RECORDS</p>
          <h1>公司库</h1>
          <p>覆盖整车、零部件、自动驾驶、智能化供应商和电池三电企业，按求职决策所需信息统一整理。</p>
        </div>
        <CompanyExplorer companies={companies} showSort />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
