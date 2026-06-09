import { DatabaseZap } from "lucide-react";

export function DataState({
  title = "暂时无法读取数据",
  description = "数据库或 API 请求失败，请稍后刷新页面。",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="data-state" role="status">
      <DatabaseZap size={28} />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
