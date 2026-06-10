import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock } from "lucide-react";
import { DataState } from "@/components/ui/data-state";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCalendarEvents } from "@/lib/data";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function CalendarPage() {
  try {
    const events = await getCalendarEvents();
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * DAY_MS);
    const inThirtyDays = new Date(now.getTime() + 30 * DAY_MS);
    const groups = [
      { title: "7天内截止", items: events.filter((event) => event.eventType === "网申截止" && new Date(event.eventDate) >= now && new Date(event.eventDate) <= inSevenDays) },
      { title: "30天内截止", items: events.filter((event) => event.eventType === "网申截止" && new Date(event.eventDate) > inSevenDays && new Date(event.eventDate) <= inThirtyDays) },
      { title: "本月开启", items: events.filter((event) => event.eventType === "网申开始" && sameMonth(new Date(event.eventDate), now)) },
      { title: "待确认重点关注", items: events.filter((event) => event.credibility === "待核实" || event.status === "待确认").slice(0, 10) },
    ];

    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">2027 RECRUITMENT TIMELINE</p><h1>2027届车辆行业校招日历</h1>
          <p>使用真实当前日期分组网申开启、截止、笔试、面试和宣讲节点。当前日期：{now.toLocaleDateString("zh-CN")}。缺少来源链接的事件会标记为待核验。</p>
        </div>
        <div className="calendar-groups">
          {groups.map((group) => (
            <section className="calendar-group" key={group.title}>
              <div className="calendar-group-title"><CalendarClock size={19} /><h2>{group.title}</h2><span>{group.items.length}</span></div>
              {group.items.length ? group.items.map((event) => (
                <article className={`calendar-event ${event.sourceUrl ? "" : "calendar-event-unverified"}`} data-testid="calendar-event" key={event.id}>
                  <time><strong>{new Date(event.eventDate).getDate()}</strong><span>{new Date(event.eventDate).toLocaleDateString("zh-CN", { month: "short" })}</span></time>
                  <div>
                    <p className="eyebrow">{event.eventType}</p>
                    <h3>{event.title}</h3>
                    <span>{event.company.name} · {new Date(event.eventDate).toLocaleDateString("zh-CN")} · 可信度：{event.credibility}</span>
                    {!event.sourceUrl && <small className="risk-note"><AlertTriangle size={13} />待核验来源链接</small>}
                  </div>
                  <StatusBadge status={event.status} />
                  <div className="calendar-actions">
                    <ExternalLink href={event.sourceUrl} emptyLabel="来源待补">
                      来源链接
                    </ExternalLink>
                    <ExternalLink href={event.recruitment?.applyUrl} className="button button-accent" emptyLabel="投递待补">
                      投递入口
                    </ExternalLink>
                    <Link href={`/companies/${event.company.slug}`} className="button button-secondary">详情<ArrowRight size={15} /></Link>
                  </div>
                </article>
              )) : <p className="empty-row">当前分组暂无事件。</p>}
            </section>
          ))}
        </div>
      </div>
    );
  } catch {
    return <div className="shell page-space"><DataState /></div>;
  }
}

function sameMonth(date: Date, target: Date) {
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();
}
