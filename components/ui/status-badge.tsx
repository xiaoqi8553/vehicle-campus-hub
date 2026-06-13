const statusClasses: Record<string, string> = {
  正在招聘: "status-open",
  "2027 项目已开放": "status-open",
  "等待 2027 项目": "status-upcoming",
  信息待确认: "status-unknown",
  已开启: "status-open",
  即将截止: "status-closing",
  未开始: "status-upcoming",
  已结束: "status-ended",
  待确认: "status-unknown",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status-badge ${statusClasses[status] ?? "status-unknown"}`}>{status}</span>
  );
}
