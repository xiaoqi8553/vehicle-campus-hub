import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function DirectionCard({
  title,
  description,
  count,
  icon: Icon,
}: {
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
}) {
  return (
    <Link className="direction-card" href={`/companies?direction=${encodeURIComponent(title)}`}>
      <span className="direction-icon">
        <Icon size={22} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="direction-count">{count} 家</span>
      <ArrowRight size={17} />
    </Link>
  );
}
