import { ArrowUpRight, MessageSquareText } from "lucide-react";

const FEEDBACK_URL =
  "https://github.com/xiaoqi8553/vehicle-campus-hub/issues/new?template=data-correction.md";

export function FeedbackCallout({ companyName }: { companyName?: string }) {
  const label = companyName ? `反馈${companyName}信息` : "提交信息反馈";

  return (
    <aside className="feedback-callout">
      <span>
        <MessageSquareText size={20} />
      </span>
      <h2>发现信息有变化？</h2>
      <p>提交正确链接或官方公告，我们会在核验后更新。</p>
      <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" aria-label={label}>
        {label}
        <ArrowUpRight size={16} />
      </a>
    </aside>
  );
}
