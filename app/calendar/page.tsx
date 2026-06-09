import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { DataState } from "@/components/ui/data-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCalendarEvents } from "@/lib/data";

export default async function CalendarPage() {
  try {
    const events = await getCalendarEvents();
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const groups = [
      { title: "7天内即将截止", items: events.filter((event) => event.eventType === "网申截止" && new Date(event.eventDate) >= now && new Date(event.eventDate) <= inSevenDays) },
      { title: "本月开启", items: events.filter((event) => event.eventType === "网申开始" && sameMonth(new Date(event.eventDate), now)) },
      { title: "本月截止", items: events.filter((event) => event.eventType === "网申截止" && sameMonth(new Date(event.eventDate), now) && new Date(event.eventDate) > inSevenDays) },
      { title: "未来校招", items: events.filter((event) => new Date(event.eventDate) > new Date(now.getFullYear(), now.getMonth() + 1, 0)) },
    ];

    return (
      <div className="shell page-space">
        <div className="page-heading">
          <p className="eyebrow">RECRUITMENT TIMELINE</p><h1>校招日历</h1>
          <p>聚合网申开启、截止、笔试和面试节点。当前日期：{now.toLocaleDateString("zh-CN")}。</p>
        </div>
        <div className="calendar-groups">
          {groups.map((group) => (
            <section className="calendar-group" key={group.title}>
              <div className="calendar-group-title"><CalendarClock size={19} /><h2>{group.title}</h2><span>{group.items.length}</span></div>
              {group.items.length ? group.items.map((event) => (
                <article className="calendar-event" data-testid="calendar-event" key={event.id}>
                  <time><strong>{new Date(event.eventDate).getDate()}</strong><span>{new Date(event.eventDate).toLocaleDateString("zh-CN", { month: "short" })}</span></time>
                  <div><p className="eyebrow">{event.eventType}</p><h3>{event.title}</h3><span>{event.company.name}</span></div>
                  <StatusBadge status={event.status} />
                  <Link href={`/companies/${event.companyId}`} className="button button-secondary">查看详情<ArrowRight size={15} /></Link>
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
