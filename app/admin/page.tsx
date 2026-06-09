import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { DataState } from "@/components/ui/data-state";
import { getAdminData } from "@/lib/data";

export default async function AdminPage() {
  try {
    const data = await getAdminData();
    return (
      <div className="shell page-space admin-page">
        <div className="page-heading">
          <p className="eyebrow">OPERATIONS CONSOLE</p><h1>后台管理</h1>
          <p>维护公司、校招项目、岗位和资料。MVP 暂不启用登录，但数据模型已预留 ADMIN 角色。</p>
        </div>
        <AdminDashboard data={data} />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
