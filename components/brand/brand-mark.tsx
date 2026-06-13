export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={compact ? "brand-symbol brand-symbol-compact" : "brand-symbol"}
      aria-hidden="true"
    >
      <span />
      <i />
    </span>
  );
}
