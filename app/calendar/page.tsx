import Link from "next/link";
import { ArrowRight, CalendarClock, Radar } from "lucide-react";
import { DataState } from "@/components/ui/data-state";
import { ExternalLink } from "@/components/ui/external-link";
import { getCalendarEvents, getCompanies } from "@/lib/data";
import { groupCalendarEvents } from "@/lib/domain";

export default async function CalendarPage() {
  try {
    const [events, companies] = await Promise.all([getCalendarEvents(), getCompanies()]);
    const groups = groupCalendarEvents(events);
    const verifiedEvents = [...groups.sevenDays, ...groups.thirtyDays, ...groups.currentMonth];

    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">VERIFIED TIMELINE</p>
          <h1>2027届车辆行业校招日历</h1>
          <p>只发布同时具备可靠来源、人工核验时间和明确日期的事件。当前没有证据时，页面宁可留空。</p>
        </div>

        <section className="calendar-summary">
          <article><strong>{groups.sevenDays.length}</strong><span>7 天内截止</span></article>
          <article><strong>{groups.thirtyDays.length}</strong><span>30 天内截止</span></article>
          <article><strong>{groups.currentMonth.length}</strong><span>本月开启</span></article>
        </section>

        <section className="calendar-timeline">
          <div className="section-heading compact-heading"><div><p className="eyebrow">PUBLISHED EVENTS</p><h2>已核验时间线</h2></div></div>
          {verifiedEvents.length ? verifiedEvents.map((event) => (
            <article className="calendar-event" data-testid="calendar-event" key={event.id}>
              <time dateTime={event.eventDate ?? undefined}>{event.eventDate ? new Date(event.eventDate).toLocaleDateString("zh-CN") : ""}</time>
              <div><strong>{event.company.name}</strong><span>{event.title}</span></div>
              <ExternalLink href={event.sourceUrl} emptyLabel="来源待补">核对来源</ExternalLink>
            </article>
          )) : (
            <div className="calendar-empty">
              <CalendarClock size={30} />
              <strong>暂无已核验招聘日程</strong>
              <p>尚未获得可同时证明日期、事件类型和来源的 2027 届官方信息。</p>
            </div>
          )}
        </section>

        <section className="watchlist-section">
          <div className="section-heading compact-heading">
            <div><p className="eyebrow">WATCHLIST</p><h2>持续跟踪企业</h2></div>
            <p>招聘官网可用于观察，不等于批次已经开放。</p>
          </div>
          <div className="watchlist">
            {companies.map((company) => (
              <article className="watchlist-row" data-testid="watchlist-row" key={company.id}>
                <Radar size={16} />
                <strong>{company.name}</strong>
                <span>{company.recruitments?.length ? "已有 2027 实习证据" : "日期待官方发布"}</span>
                <ExternalLink href={company.recruitmentWebsite} emptyLabel="入口待复核">招聘官网</ExternalLink>
                <Link href={`/companies/${company.slug}`} aria-label={`查看 ${company.name} 档案`}><ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}
