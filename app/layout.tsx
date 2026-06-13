import type { Metadata } from "next";
import "./globals.css";
import "./public-site.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: {
    default: "车招雷达 | 2027届车辆行业校招",
    template: "%s | 车招雷达",
  },
  description: "聚合车辆行业官方招聘入口、校招进度、技术方向和求职指南。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
