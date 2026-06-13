import { BookOpenCheck, Route } from "lucide-react";
import { ResourceExplorer } from "@/components/resource/resource-explorer";
import { DataState } from "@/components/ui/data-state";
import { PageHero } from "@/components/ui/page-hero";
import { getResources } from "@/lib/data";

export default async function ResourcesPage() {
  try {
    const resources = await getResources();
    return (
      <div className="shell page-space">
        <PageHero
          eyebrow="求职指南"
          title="车辆行业求职指南"
          description="从简历准备到技术面试，按车辆技术方向整理完整阅读材料。每篇内容都包含正文、章节和可执行检查清单。"
          aside={
            <div className="page-stat-pills">
              <span>
                <BookOpenCheck size={16} />
                {resources.length} 篇完整指南
              </span>
              <span>
                <Route size={16} />
                适用 2027 届
              </span>
            </div>
          }
        />
        <ResourceExplorer resources={resources} />
      </div>
    );
  } catch {
    return (
      <div className="shell page-space">
        <DataState />
      </div>
    );
  }
}
