import { DatabaseZap } from "lucide-react";

export function DataState({
  title = "页面暂时没有加载成功",
  description = "请稍后重试。已经收录的信息不会因此丢失。",
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
