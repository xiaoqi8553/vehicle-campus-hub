import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <BrandMark compact />
          <div>
            <strong>车招雷达</strong>
            <p>为车辆方向学生整理可信、清楚的校招信息。</p>
          </div>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/companies">公司机会</Link>
          <Link href="/calendar">招聘日历</Link>
          <Link href="/resources">求职指南</Link>
          <Link href="/about">关于我们</Link>
        </nav>
        <div className="footer-note">
          <p>招聘信息以企业官方发布为准。</p>
          <Link href="/about#feedback">发现变化？提交反馈</Link>
        </div>
      </div>
    </footer>
  );
}
