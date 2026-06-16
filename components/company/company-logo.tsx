import { Building2 } from "lucide-react";

export function CompanyLogo({
  name,
  logo,
  size = "md",
}: {
  name: string;
  logo: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`company-logo-frame company-logo-${size}`}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- Local favicon, ico and svg assets are tiny and should keep their original aspect ratio.
        <img className="company-logo" src={logo} alt={`${name} logo`} loading="lazy" />
      ) : (
        <span
          className="company-logo-fallback"
          data-testid="company-logo-fallback"
          aria-label={`${name} logo 待补充`}
        >
          <Building2 size={size === "sm" ? 18 : 22} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
