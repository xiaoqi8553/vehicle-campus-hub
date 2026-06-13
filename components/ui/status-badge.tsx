const statusClasses: Record<string, string> = {
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
