import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { DataState } from "@/components/ui/data-state";
import { getAdminData } from "@/lib/data";

export default async function AdminPage() {
  if (process.env.ADMIN_ENABLED !== "true") notFound();

  try {
    const data = await getAdminData();
    return (
      <div className="shell page-space admin-page">
        <div className="page-heading">
          <p className="eyebrow">OPERATIONS CONSOLE</p><h1>后台管理</h1>
          <p>维护 Company、RecruitmentProgram、Job、Resource、CalendarEvent。生产环境默认关闭，需通过环境变量显式启用。</p>
        </div>
        <AdminDashboard data={data} />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
