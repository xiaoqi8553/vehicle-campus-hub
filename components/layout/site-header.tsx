import Link from "next/link";
import { Menu, MessageSquareText } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/companies", label: "公司机会" },
  { href: "/calendar", label: "招聘日历" },
  { href: "/resources", label: "求职指南" },
  { href: "/about", label: "关于我们" },
];

export function SiteHeader() {
  const items =
    process.env.ADMIN_ENABLED === "true"
      ? [...navItems, { href: "/admin", label: "后台管理" }]
      : navItems;

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="site-brand" aria-label="车招雷达首页">
          <BrandMark />
          <span>
            <strong>车招雷达</strong>
            <small>Vehicle Campus Hub</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="nav-feedback" href="/about#feedback">
            <MessageSquareText size={16} />
            反馈信息
          </Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="打开导航">
            <Menu size={22} />
          </summary>
          <nav className="mobile-nav-panel" aria-label="移动导航">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/about#feedback">反馈信息</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
