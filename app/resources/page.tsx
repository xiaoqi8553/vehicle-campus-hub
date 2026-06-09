import { ResourceExplorer } from "@/components/resource/resource-explorer";
import { DataState } from "@/components/ui/data-state";
import { getResources } from "@/lib/data";

export default async function ResourcesPage() {
  try {
    const resources = await getResources();
    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">KNOWLEDGE GARAGE / {resources.length} RESOURCES</p>
          <h1>笔试面经</h1>
          <p>按公司、类型和可信度整理笔试、面试、测评、简历与投递攻略，经验信息仅作准备参考。</p>
        </div>
        <ResourceExplorer resources={resources} />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
