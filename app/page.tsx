import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, CalendarClock, ClipboardCheck, Link2, RadioTower, Sparkles } from "lucide-react";
import { CompanyExplorer } from "@/components/company/company-explorer";
import { CompanyCard } from "@/components/company/company-card";
import { DataState } from "@/components/ui/data-state";
import { getCompanies } from "@/lib/data";
import { safeExternalUrl } from "@/lib/domain";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function HomePage() {
  try {
    const companies = await getCompanies();
    const now = new Date();
    const officialLinkCount = companies.filter((company) => {
      const program = company.recruitments?.[0];
      return Boolean(
        safeExternalUrl(program?.applyUrl ?? company.campusRecruitmentWebsite)
        && (program?.sourceType === "OFFICIAL" ? program.verifiedAt : company.verifiedAt),
      );
    }).length;
    const activeCompanies = companies.filter((company) => {
      const program = company.recruitments?.[0];
      return program?.status === "已开启"
        && program.dateConfidence === "VERIFIED"
        && Boolean(program.verifiedAt);
    });
    const closingSoon = companies.filter((company) => {
      const program = company.recruitments?.[0];
      const endDate = program?.endDate;
      if (!endDate || program.dateConfidence !== "VERIFIED" || !program.verifiedAt) return false;
      const daysLeft = Math.ceil((Date.parse(endDate) - now.getTime()) / DAY_MS);
      return daysLeft >= 0 && daysLeft <= 7;
    });
    const missingLinks = companies.filter((company) =>
      !safeExternalUrl(company.recruitments?.[0]?.applyUrl ?? company.campusRecruitmentWebsite),
    );
    const stats = [
      { label: "已收录企业", value: companies.length, icon: Building2 },
      { label: "已核验官方链接", value: officialLinkCount, icon: Link2 },
      { label: "已开启校招", value: activeCompanies.length, icon: RadioTower },
      { label: "7天内即将截止", value: closingSoon.length, icon: CalendarClock },
      { label: "待补链接", value: missingLinks.length, icon: AlertTriangle },
    ];
    const focusGroups = [
      { title: "正在投递", copy: "优先处理已开启且有官方入口的企业。", items: activeCompanies.slice(0, 3) },
      { title: "即将截止", copy: "7 天内截止的节点需要单独提醒。", items: closingSoon.slice(0, 3) },
      { title: "待确认但值得关注", copy: "有方向价值但缺少 2027 届官方链接，适合加入观察清单。", items: missingLinks.slice(0, 3) },
    ];
    const productSignals = [
      { title: "校招日程", copy: "按 7 天截止、30 天截止、本月开启组织时间线。", href: "/calendar", icon: CalendarClock },
      { title: "24h 更新视角", copy: "用最近更新时间和核验状态区分新信息与待确认信息。", href: "/companies", icon: Sparkles },
      { title: "投递进度管理", copy: "先保留官方入口、截止节点和反馈纠错，后续扩展个人看板。", href: "/about", icon: ClipboardCheck },
    ];
    const latestUpdates = companies
      .filter((company) => company.changeSummary?.trim())
      .slice(0, 5);
    const featuredCompanies = [...companies]
      .sort((a, b) => {
        const aProgram = a.recruitments?.[0];
        const bProgram = b.recruitments?.[0];
        const score = (company: typeof a, program: typeof aProgram) =>
          Number(Boolean(company.verifiedAt)) * 4
          + Number(Boolean(safeExternalUrl(program?.applyUrl ?? company.campusRecruitmentWebsite))) * 2
          + Number(company.dataStatus === "已核验");
        return score(b, bProgram) - score(a, aProgram)
          || a.name.localeCompare(b.name, "zh-CN");
      })
      .slice(0, 6);

    return (
      <>
        <section className="hero">
          <div className="hero-grid-lines" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">Vehicle Campus Hub / 2027</p>
              <h1><span>2027届车辆行业校招信息聚合平台</span>2027届车辆行业校招雷达</h1>
              <p className="hero-lead">聚合车企、新势力、自动驾驶、三电、零部件企业的官方投递入口、时间线、岗位方向和笔试面经，服务车辆工程、机械、自动化、控制、嵌入式、自动驾驶、电池与热管理方向学生。</p>
              <div className="hero-actions">
                <Link href="#companies" className="button button-accent">浏览校招企业<ArrowRight size={16} /></Link>
                <Link href="/calendar" className="button button-ghost">查看校招日历</Link>
              </div>
            </div>
            <div className="hero-dashboard" aria-hidden="true">
              <div className="dashboard-header"><span>INDUSTRY SIGNAL</span><i /></div>
              <div className="radar">
                <div className="radar-ring ring-one" /><div className="radar-ring ring-two" />
                <div className="radar-sweep" /><span className="radar-dot dot-one" /><span className="radar-dot dot-two" /><span className="radar-dot dot-three" />
                <strong>{companies.length}</strong><small>2027 TRACKED COMPANIES</small>
              </div>
              <div className="dashboard-ticks"><span>整车</span><span>三电</span><span>智驾</span><span>软件</span></div>
            </div>
          </div>
        </section>

        <section className="stats-band">
          <div className="shell stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return <article key={stat.label}><Icon size={20} /><div><strong>{stat.value}</strong><span>{stat.label}</span></div></article>;
            })}
          </div>
        </section>

        <section className="shell signal-strip" aria-label="校招雷达功能入口">
          {productSignals.map((item) => {
            const Icon = item.icon;
            return (
              <Link className="signal-card" href={item.href} key={item.title}>
                <Icon size={20} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            );
          })}
        </section>

        <section className="shell page-section focus-section">
          <div className="section-heading">
            <div><p className="eyebrow">TODAY FOCUS</p><h2>今日重点</h2></div>
            <p>先处理“能投递、快截止、值得关注但待核验”的信息，避免在高密度列表里迷失。</p>
          </div>
          <div className="focus-grid">
            {focusGroups.map((group) => (
              <article className="focus-card" key={group.title}>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.copy}</p>
                </div>
                {group.items.length ? (
                  <ul>
                    {group.items.map((company) => (
                      <li key={company.id}>
                        <span>{company.shortName}</span>
                        <Link className="focus-link" href={`/companies/${company.slug}`}>查看</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-row">暂无匹配企业。</p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="shell page-section" id="companies">
          <div className="section-heading">
            <div><p className="eyebrow">FEATURED COMPANIES</p><h2>重点公司卡片</h2></div>
            <p>卡片优先展示 2027 届状态、官方投递入口、车辆方向标签和数据核验状态。</p>
          </div>
          <div className="company-grid" data-testid="featured-companies">
            {featuredCompanies.map((company) => <CompanyCard key={company.id} company={company} />)}
          </div>
          <div className="section-actions">
            <Link href="/companies" className="button button-primary">进入完整公司库<ArrowRight size={15} /></Link>
          </div>
        </section>

        <section className="shell page-section">
          <div className="section-heading">
            <div><p className="eyebrow">QUICK FILTER</p><h2>快速筛选</h2></div>
            <p>支持公司名、城市、岗位方向搜索，适合移动端快速定位目标企业。</p>
          </div>
          <CompanyExplorer companies={companies} limit={6} />
        </section>

        <section className="shell page-section latest-section">
          <div className="section-heading">
            <div><p className="eyebrow">LATEST UPDATES</p><h2>最新更新</h2></div>
            <p>仅展示最近更新的企业记录，核验时间和官方入口状态以详情页为准。</p>
          </div>
          <div className="update-list">
            {latestUpdates.map((company) => (
              <Link href={`/companies/${company.slug}`} className="update-row" data-testid="latest-update" key={company.id}>
                <span>{company.shortName}</span>
                <strong data-testid="change-summary">{company.changeSummary}</strong>
                <small>
                  内容更新 {new Date(company.lastUpdatedAt).toLocaleDateString("zh-CN")}
                  {" · "}
                  最后核验 {company.verifiedAt ? new Date(company.verifiedAt).toLocaleDateString("zh-CN") : "待补充"}
                </small>
              </Link>
            ))}
          </div>
        </section>

        <section className="about-band">
          <div className="shell about-grid">
            <div><p className="eyebrow">WHY THIS PROJECT</p><h2>为车辆行业学生重做校招信息结构</h2></div>
            <div className="about-points">
              <p><strong>01</strong>明确 2027 届，避免把往届经验误当成当前批次信息。</p>
              <p><strong>02</strong>官方、较可信、经验参考和待核实分层展示，不假装所有内容都可投递。</p>
              <p><strong>03</strong>数据结构面向 Web、微信小程序和 App 复用，后续可扩展收藏、订阅和纠错队列。</p>
            </div>
          </div>
        </section>
      </>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
