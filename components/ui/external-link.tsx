import type { ReactNode } from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { safeExternalUrl } from "@/lib/domain";

export function ExternalLink({
  href,
  children,
  className = "button button-secondary",
  emptyLabel = "暂无投递链接",
  ariaLabel,
}: {
  href: string | null | undefined;
  children: ReactNode;
  className?: string;
  emptyLabel?: string;
  ariaLabel?: string;
}) {
  const safeUrl = safeExternalUrl(href);
  if (!safeUrl) return <span className={`${className} button-disabled`}>{emptyLabel}</span>;
  return (
    <a aria-label={ariaLabel} className={className} href={safeUrl} target="_blank" rel="noreferrer">
      {children}<ExternalLinkIcon size={15} />
    </a>
  );
}
