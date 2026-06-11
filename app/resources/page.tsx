import { ResourceExplorer } from "@/components/resource/resource-explorer";
import { DataState } from "@/components/ui/data-state";
import { getResources } from "@/lib/data";

export default async function ResourcesPage() {
  try {
    const resources = await getResources();
    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">PREPARATION LIBRARY / {resources.length} GUIDES</p>
          <h1>2027届车辆行业求职资料库</h1>
          <p>公共方法资料只保留一次，不再为每家公司复制模板。所有内容均明确区分平台整理与外部来源。</p>
        </div>
        <ResourceExplorer resources={resources} />
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
