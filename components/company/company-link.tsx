import { ExternalLink as ExternalLinkIcon, ShieldCheck } from "lucide-react";
import type { CompanyLinkData } from "@/lib/data";
import {
  externalDomain,
  isUsableLinkEvidence,
  linkHealthLabel,
  linkSourceTypeLabel,
} from "@/lib/domain";

function date(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "UTC" }).format(new Date(value))
    : "待人工确认";
}

export function CompanyLinkAction({
  companyName,
  link,
  className = "button button-primary",
}: {
  companyName: string;
  link: CompanyLinkData | null | undefined;
  className?: string;
}) {
  if (!link || !isUsableLinkEvidence(link)) {
    return <span className={`${className} button-disabled`}>暂无可用官方入口</span>;
  }
  return (
    <a
      aria-label={`打开${companyName}：${link.title}`}
      className={className}
      href={link.url ?? undefined}
      rel="noreferrer"
      target="_blank"
    >
      {link.title}<ExternalLinkIcon size={15} />
    </a>
  );
}

export function LinkEvidenceRow({
  companyName,
  link,
}: {
  companyName: string;
  link: CompanyLinkData;
}) {
  const usable = isUsableLinkEvidence(link);
  const content = (
    <>
      <span className="source-kind">{linkSourceTypeLabel(link.sourceType)}</span>
      <strong>{link.title}</strong>
      <span>{externalDomain(link.url)} · 面向 {link.targetCohort}</span>
      <small><ShieldCheck size={13} /><span className={`link-health health-${link.healthStatus.toLowerCase()}`}>{linkHealthLabel(link.healthStatus)}</span> · 核验于 {date(link.verifiedAt)}</small>
      <p>{link.evidenceSummary}</p>
    </>
  );

  return usable ? (
    <a
      aria-label={`打开${companyName}：${link.title}`}
      className="source-row"
      href={link.url ?? undefined}
      rel="noreferrer"
      target="_blank"
    >
      {content}<ExternalLinkIcon className="source-row-icon" size={16} />
    </a>
  ) : (
    <div className="source-row source-row-disabled" aria-label={`${companyName}：${link.title}，${linkHealthLabel(link.healthStatus)}`}>
      {content}
    </div>
  );
}
