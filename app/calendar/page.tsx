import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock } from "lucide-react";
import { DataState } from "@/components/ui/data-state";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCalendarEvents } from "@/lib/data";
import { groupCalendarEvents, sourceTypeLabel } from "@/lib/domain";

export default async function CalendarPage() {
  try {
    const events = await getCalendarEvents();
    const now = new Date();
    const grouped = groupCalendarEvents(events, now);
    const groups = [
      { title: "7天内截止", items: grouped.sevenDays, pending: false },
      { title: "30天内截止", items: grouped.thirtyDays, pending: false },
      { title: "本月开启", items: grouped.currentMonth, pending: false },
      { title: "待核实观察清单", items: grouped.pending, pending: true },
    ];

    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">2027 RECRUITMENT TIMELINE</p><h1>2027届车辆行业校招日历</h1>
          <p>仅将日期已核验且有可靠来源的事件放入正式时间线。当前日期：{now.toLocaleDateString("zh-CN")}。其余记录进入按企业去重的观察清单，不展示未经核验的精确日期。</p>
        </div>
        <div className="calendar-groups">
          {groups.map((group) => (
            <section
              className="calendar-group"
              data-testid={group.pending ? "calendar-pending" : undefined}
              key={group.title}
            >
              <div className="calendar-group-title"><CalendarClock size={19} /><h2>{group.title}</h2><span>{group.items.length}</span></div>
              {group.items.length ? group.items.map((event) => (
                <article
                  className={`calendar-event ${group.pending ? "calendar-event-unverified" : ""}`}
                  data-calendar-event-id={event.id}
                  data-has-source={Boolean(event.sourceUrl)}
                  data-testid="calendar-event"
                  key={event.id}
                >
                  {group.pending || !event.eventDate ? (
                    <div className="calendar-date-pending"><AlertTriangle size={18} /><span>日期待确认</span></div>
                  ) : (
                    <time dateTime={event.eventDate}>
                      <strong>{new Date(event.eventDate).getUTCDate()}</strong>
                      <span>{new Date(event.eventDate).toLocaleDateString("zh-CN", { month: "short", timeZone: "UTC" })}</span>
                    </time>
                  )}
                  <div>
                    <p className="eyebrow">{event.eventType}</p>
                    <h3>{event.title}</h3>
                    <span>
                      {event.company.name}
                      {" · "}
                      {group.pending || !event.eventDate
                        ? "日期待确认"
                        : new Date(event.eventDate).toLocaleDateString("zh-CN", { timeZone: "UTC" })}
                      {" · "}
                      {sourceTypeLabel(event.sourceType)}
                      {" · "}
                      最后核验 {event.verifiedAt ? new Date(event.verifiedAt).toLocaleDateString("zh-CN") : "待补充"}
                    </span>
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
