import Link from "next/link";
import { Gauge, Menu } from "lucide-react";

const navItems = [
  { href: "/companies", label: "公司库" },
  { href: "/calendar", label: "校招日历" },
  { href: "/resources", label: "笔试面经" },
  { href: "/about", label: "关于项目" },
];

export function SiteHeader() {
  const items = process.env.ADMIN_ENABLED === "true"
    ? [...navItems, { href: "/admin", label: "后台管理" }]
    : navItems;

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="Vehicle Campus Hub 首页">
          <span className="brand-mark"><Gauge size={20} /></span>
          <span>Vehicle Campus Hub</span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary aria-label="打开导航"><Menu size={22} /></summary>
          <div className="mobile-nav-panel">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
