import { ResourceExplorer } from "@/components/resource/resource-explorer";
import { DataState } from "@/components/ui/data-state";
import { getResources } from "@/lib/data";

export default async function ResourcesPage() {
  try {
    const resources = await getResources();
    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">2027 KNOWLEDGE GARAGE / {resources.length} RESOURCES</p>
          <h1>2027届车辆行业笔试面经资料库</h1>
          <p>按自动驾驶、嵌入式 C/C++、底盘车辆动力学、三电电池热管理、测评行测和简历项目包装拆分资料。没有真实来源链接时会显示“暂无链接，待补充”。</p>
        </div>
        <ResourceExplorer resources={resources} />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
