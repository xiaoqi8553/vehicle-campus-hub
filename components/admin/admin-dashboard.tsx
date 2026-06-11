"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Building2, CalendarClock, CalendarRange, FileText, Plus } from "lucide-react";
import type { CalendarEventData, CompanyCardData, JobData, RecruitmentData, ResourceData } from "@/lib/data";
import {
  CALENDAR_EVENT_TYPES,
  COMPANY_CATEGORIES,
  CREDIBILITY_LEVELS,
  JOB_DIRECTIONS,
  RECRUITMENT_STATUSES,
  RESOURCE_TYPES,
} from "@/lib/constants";

type AdminProps = {
  data: {
    companies: CompanyCardData[];
    recruitments: Array<RecruitmentData & { companyName: string }>;
    jobs: Array<JobData & { companyName: string }>;
    resources: Array<ResourceData & { companyName: string }>;
    calendarEvents: Array<CalendarEventData & { companyName: string }>;
  };
};

const sections = [
  { id: "companies", label: "公司管理", icon: Building2 },
  { id: "recruitments", label: "校招项目管理", icon: CalendarRange },
  { id: "jobs", label: "岗位管理", icon: BriefcaseBusiness },
  { id: "resources", label: "资料管理", icon: FileText },
  { id: "calendarEvents", label: "日历事件管理", icon: CalendarClock },
] as const;

export function AdminDashboard({ data }: AdminProps) {
  const router = useRouter();
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("companies");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>, endpoint: string) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "提交失败");
      setMessage({ type: "success", text: "保存成功，数据已写入数据库。" });
      form.reset();
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "提交失败" });
    } finally {
      setPending(false);
    }
  }

  async function updateRecord(endpoint: string, id: string, body: Record<string, unknown>) {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "更新失败");
      setMessage({ type: "success", text: "记录已更新。" });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "更新失败" });
    } finally {
      setPending(false);
    }
  }

  async function deleteRecord(endpoint: string, id: string) {
    if (!window.confirm("确认删除这条记录？关联数据可能同步删除。")) return;
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "删除失败");
      setMessage({ type: "success", text: "记录已删除。" });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "删除失败" });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="mini-label">数据工作台</p>
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              className={active === section.id ? "active" : ""}
              key={section.id}
              onClick={() => { setActive(section.id); setMessage(null); }}
              type="button"
            >
              <Icon size={17} />{section.label}
            </button>
          );
        })}
      </aside>

      <div className="admin-main">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">ADMIN / DATA OPERATIONS</p>
            <h2>{sections.find((item) => item.id === active)?.label}</h2>
          </div>
          <span className="admin-role">ADMIN 角色预留</span>
        </div>
        {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

        {active === "companies" && (
          <>
            <AdminForm title="新增公司" onSubmit={(event) => submit(event, "/api/companies")} pending={pending}>
              <input aria-label="公司名称" name="name" placeholder="公司名称 *" required />
              <select aria-label="公司类型" name="category" required defaultValue=""><option value="" disabled>公司类型 *</option>{COMPANY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
              <select aria-label="公司校招状态" name="status" required defaultValue="待确认">{RECRUITMENT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
              <input aria-label="公司城市" name="cities" placeholder="城市，逗号分隔 *" required />
              <input aria-label="公司标签" name="tags" placeholder="标签，逗号分隔 *" required />
              <input aria-label="车辆方向" name="fitDirections" placeholder="适配方向，逗号分隔 *" required />
              <input aria-label="公司官网" name="officialWebsite" placeholder="公司官网（可空）" />
              <input aria-label="校招官网" name="campusUrl" placeholder="校招官网（可空）" />
              <textarea aria-label="公司简介" name="description" placeholder="公司简介 *" required />
            </AdminForm>
            <CompanyEditor
              companies={data.companies.slice(0, 12)}
              pending={pending}
              onUpdate={(id, body) => updateRecord("/api/companies", id, body)}
              onDelete={(id) => deleteRecord("/api/companies", id)}
            />
          </>
        )}

        {active === "recruitments" && (
          <>
            <AdminForm title="新增校招项目" onSubmit={(event) => submit(event, "/api/recruitments")} pending={pending}>
              <CompanySelect companies={data.companies} />
              <input aria-label="目标届别" name="year" type="number" defaultValue="2027" required />
              <input aria-label="招聘季节" name="season" placeholder="招聘季节 *" required />
              <input aria-label="校招项目标题" name="title" placeholder="项目标题 *" required />
              <select aria-label="校招项目状态" name="status" required defaultValue="待确认">{RECRUITMENT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
              <input aria-label="校招开始日期" name="startDate" type="date" />
              <input aria-label="校招截止日期" name="endDate" type="date" />
              <input aria-label="校招投递链接" name="applyUrl" placeholder="投递链接（可空）" />
              <input aria-label="校招来源链接" name="sourceUrl" placeholder="来源链接（可空）" />
              <input aria-label="校招可信度" name="credibility" defaultValue="待核实" required />
              <textarea aria-label="校招流程" name="process" defaultValue="流程待核实" required />
            </AdminForm>
            <RecruitmentEditor
              items={data.recruitments.slice(0, 12)}
              pending={pending}
              onUpdate={(id, body) => updateRecord("/api/recruitments", id, body)}
            />
          </>
        )}

        {active === "jobs" && (
          <>
            <AdminForm title="新增岗位" onSubmit={(event) => submit(event, "/api/jobs")} pending={pending}>
              <CompanySelect companies={data.companies} />
              <input aria-label="岗位名称" name="title" placeholder="岗位名称 *" required />
              <select aria-label="岗位方向" name="direction" required defaultValue=""><option value="" disabled>岗位方向 *</option>{JOB_DIRECTIONS.map((item) => <option key={item}>{item}</option>)}</select>
              <input aria-label="岗位城市" name="city" placeholder="城市 *" required />
              <input aria-label="学历要求" name="education" defaultValue="待核实" required />
              <input aria-label="专业要求" name="majorRequirement" placeholder="专业要求 *" required />
              <input aria-label="岗位投递链接" name="applyUrl" placeholder="投递链接（可空）" />
              <input name="vehicleFitScore" type="hidden" value="0" />
            </AdminForm>
            <JobEditor
              items={data.jobs.slice(0, 12)}
              pending={pending}
              onUpdate={(id, body) => updateRecord("/api/jobs", id, body)}
            />
          </>
        )}

        {active === "resources" && (
          <>
            <AdminForm title="新增资料" onSubmit={(event) => submit(event, "/api/resources")} pending={pending}>
              <CompanySelect companies={data.companies} />
              <input aria-label="资料标题" name="title" placeholder="资料标题 *" required />
              <select aria-label="资料类型" name="type" required>{RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
              <select aria-label="资料可信度" name="credibility" required>{CREDIBILITY_LEVELS.map((item) => <option key={item}>{item}</option>)}</select>
              <input aria-label="资料来源" name="source" placeholder="资料来源 *" required />
              <input aria-label="资料外部链接" name="url" placeholder="外部链接（可空）" />
              <textarea aria-label="资料简介" name="summary" placeholder="资料简介 *" required />
            </AdminForm>
            <ResourceEditor
              items={data.resources.slice(0, 12)}
              pending={pending}
              onUpdate={(id, body) => updateRecord("/api/resources", id, body)}
            />
          </>
        )}

        {active === "calendarEvents" && (
          <>
            <AdminForm title="新增日历事件" onSubmit={(event) => submit(event, "/api/calendar-events")} pending={pending}>
              <CompanySelect companies={data.companies} />
              <select aria-label="日历事件类型" name="eventType" required>{CALENDAR_EVENT_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
              <input aria-label="日历事件标题" name="title" placeholder="事件标题 *" required />
              <input aria-label="日历事件日期" name="eventDate" type="date" />
              <select aria-label="日历事件状态" name="status" required defaultValue="待确认">{RECRUITMENT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
              <select aria-label="日历事件可信度" name="credibility" required defaultValue="待核实">{CREDIBILITY_LEVELS.map((item) => <option key={item}>{item}</option>)}</select>
              <input aria-label="日历事件来源链接" name="sourceUrl" placeholder="来源链接（可空）" />
            </AdminForm>
            <CalendarEventEditor
              items={data.calendarEvents.slice(0, 12)}
              pending={pending}
              onUpdate={(id, body) => updateRecord("/api/calendar-events", id, body)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function AdminForm({
  title,
  children,
  onSubmit,
  pending,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
}) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-title"><Plus size={17} /><strong>{title}</strong></div>
      <div className="admin-form-grid">{children}</div>
      <button className="button button-primary" disabled={pending} type="submit">{pending ? "保存中..." : "保存记录"}</button>
    </form>
  );
}

function CompanySelect({ companies }: { companies: CompanyCardData[] }) {
  return (
    <select aria-label="选择公司" name="companyId" defaultValue="" required>
      <option value="" disabled>选择公司 *</option>
      {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
    </select>
  );
}

type UpdateHandler = (id: string, body: Record<string, unknown>) => void;

function CompanyEditor({
  companies,
  pending,
  onUpdate,
  onDelete,
}: {
  companies: CompanyCardData[];
  pending: boolean;
  onUpdate: UpdateHandler;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>公司</th><th>状态</th><th>公司官网</th><th>校招官网</th><th>操作</th></tr></thead>
        <tbody>{companies.map((company) => (
          <CompanyEditorRow key={company.id} company={company} pending={pending} onUpdate={onUpdate} onDelete={onDelete} />
        ))}</tbody>
      </table>
    </div>
  );
}

function CompanyEditorRow({ company, pending, onUpdate, onDelete }: {
  company: CompanyCardData;
  pending: boolean;
  onUpdate: UpdateHandler;
  onDelete: (id: string) => void;
}) {
  const [status, setStatus] = useState(company.status);
  const [officialWebsite, setOfficialWebsite] = useState(company.officialWebsite ?? "");
  const [campusUrl, setCampusUrl] = useState(company.campusUrl ?? "");
  return (
    <tr>
      <td><strong>{company.name}</strong><small>{company.category}</small></td>
      <td><select aria-label={`${company.name} 状态`} value={status} onChange={(event) => setStatus(event.target.value)}>{RECRUITMENT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></td>
      <td><input aria-label={`${company.name} 公司官网`} value={officialWebsite} onChange={(event) => setOfficialWebsite(event.target.value)} placeholder="可空" /></td>
      <td><input aria-label={`${company.name} 校招官网`} value={campusUrl} onChange={(event) => setCampusUrl(event.target.value)} placeholder="可空" /></td>
      <td><div className="table-actions">
        <button disabled={pending} onClick={() => onUpdate(company.id, { status, officialWebsite, campusUrl })}>保存</button>
        <button className="danger" disabled={pending} onClick={() => onDelete(company.id)}>删除</button>
      </div></td>
    </tr>
  );
}

function RecruitmentEditor({ items, pending, onUpdate }: {
  items: Array<RecruitmentData & { companyName: string }>;
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  return (
    <div className="table-wrap"><table>
      <thead><tr><th>公司 / 项目</th><th>状态</th><th>开始</th><th>截止</th><th>投递链接</th><th>流程</th><th>操作</th></tr></thead>
      <tbody>{items.map((item) => <RecruitmentEditorRow key={item.id} item={item} pending={pending} onUpdate={onUpdate} />)}</tbody>
    </table></div>
  );
}

function RecruitmentEditorRow({ item, pending, onUpdate }: {
  item: RecruitmentData & { companyName: string };
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  const [status, setStatus] = useState(item.status);
  const [startDate, setStartDate] = useState(item.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(item.endDate?.slice(0, 10) ?? "");
  const [applyUrl, setApplyUrl] = useState(item.applyUrl ?? "");
  const [process, setProcess] = useState(item.process);
  return <tr>
    <td><strong>{item.companyName}</strong><small>{item.title}</small></td>
    <td><select aria-label={`${item.companyName} 项目状态`} value={status} onChange={(event) => setStatus(event.target.value)}>{RECRUITMENT_STATUSES.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><input aria-label={`${item.companyName} 开始日期`} type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></td>
    <td><input aria-label={`${item.companyName} 截止日期`} type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></td>
    <td><input aria-label={`${item.companyName} 投递链接`} value={applyUrl} onChange={(event) => setApplyUrl(event.target.value)} placeholder="可空" /></td>
    <td><input aria-label={`${item.companyName} 招聘流程`} value={process} onChange={(event) => setProcess(event.target.value)} /></td>
    <td><button className="table-save" disabled={pending} onClick={() => onUpdate(item.id, { status, startDate: startDate || null, endDate: endDate || null, applyUrl, process })}>保存</button></td>
  </tr>;
}

function JobEditor({ items, pending, onUpdate }: {
  items: Array<JobData & { companyName: string }>;
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  return <div className="table-wrap"><table>
    <thead><tr><th>公司 / 岗位</th><th>方向</th><th>城市</th><th>学历</th><th>专业要求</th><th>操作</th></tr></thead>
    <tbody>{items.map((item) => <JobEditorRow key={item.id} item={item} pending={pending} onUpdate={onUpdate} />)}</tbody>
  </table></div>;
}

function JobEditorRow({ item, pending, onUpdate }: {
  item: JobData & { companyName: string };
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  const [direction, setDirection] = useState(item.direction);
  const [city, setCity] = useState(item.city);
  const [education, setEducation] = useState(item.education);
  const [majorRequirement, setMajorRequirement] = useState(item.majorRequirement);
  return <tr>
    <td><strong>{item.companyName}</strong><small>{item.title}</small></td>
    <td><select aria-label={`${item.companyName} 岗位方向`} value={direction} onChange={(event) => setDirection(event.target.value)}>{JOB_DIRECTIONS.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><input aria-label={`${item.companyName} 岗位城市`} value={city} onChange={(event) => setCity(event.target.value)} /></td>
    <td><input aria-label={`${item.companyName} 学历要求`} value={education} onChange={(event) => setEducation(event.target.value)} /></td>
    <td><input aria-label={`${item.companyName} 专业要求`} value={majorRequirement} onChange={(event) => setMajorRequirement(event.target.value)} /></td>
    <td><button className="table-save" disabled={pending} onClick={() => onUpdate(item.id, { direction, city, education, majorRequirement })}>保存</button></td>
  </tr>;
}

function ResourceEditor({ items, pending, onUpdate }: {
  items: Array<ResourceData & { companyName: string }>;
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  return <div className="table-wrap"><table>
    <thead><tr><th>公司 / 资料</th><th>类型</th><th>来源</th><th>可信度</th><th>外部链接</th><th>操作</th></tr></thead>
    <tbody>{items.map((item) => <ResourceEditorRow key={item.id} item={item} pending={pending} onUpdate={onUpdate} />)}</tbody>
  </table></div>;
}

function ResourceEditorRow({ item, pending, onUpdate }: {
  item: ResourceData & { companyName: string };
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  const [type, setType] = useState(item.type);
  const [source, setSource] = useState(item.source);
  const [credibility, setCredibility] = useState(item.credibility);
  const [url, setUrl] = useState(item.url ?? "");
  return <tr>
    <td><strong>{item.companyName}</strong><small>{item.title}</small></td>
    <td><select aria-label={`${item.companyName} 资料类型`} value={type} onChange={(event) => setType(event.target.value)}>{RESOURCE_TYPES.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><input aria-label={`${item.companyName} 资料来源`} value={source} onChange={(event) => setSource(event.target.value)} /></td>
    <td><select aria-label={`${item.companyName} 资料可信度`} value={credibility} onChange={(event) => setCredibility(event.target.value)}>{CREDIBILITY_LEVELS.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><input aria-label={`${item.companyName} 资料链接`} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="可空" /></td>
    <td><button className="table-save" disabled={pending} onClick={() => onUpdate(item.id, { type, source, credibility, url })}>保存</button></td>
  </tr>;
}

function CalendarEventEditor({ items, pending, onUpdate }: {
  items: Array<CalendarEventData & { companyName: string }>;
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  return <div className="table-wrap"><table>
    <thead><tr><th>公司 / 事件</th><th>类型</th><th>日期</th><th>状态</th><th>可信度</th><th>来源链接</th><th>操作</th></tr></thead>
    <tbody>{items.map((item) => <CalendarEventEditorRow key={item.id} item={item} pending={pending} onUpdate={onUpdate} />)}</tbody>
  </table></div>;
}

function CalendarEventEditorRow({ item, pending, onUpdate }: {
  item: CalendarEventData & { companyName: string };
  pending: boolean;
  onUpdate: UpdateHandler;
}) {
  const [eventType, setEventType] = useState(item.eventType);
  const [eventDate, setEventDate] = useState(item.eventDate?.slice(0, 10) ?? "");
  const [status, setStatus] = useState(item.status);
  const [credibility, setCredibility] = useState(item.credibility);
  const [sourceUrl, setSourceUrl] = useState(item.sourceUrl ?? "");
  return <tr>
    <td><strong>{item.companyName}</strong><small>{item.title}</small></td>
    <td><select aria-label={`${item.companyName} 事件类型`} value={eventType} onChange={(event) => setEventType(event.target.value)}>{CALENDAR_EVENT_TYPES.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><input aria-label={`${item.companyName} 事件日期`} type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></td>
    <td><select aria-label={`${item.companyName} 事件状态`} value={status} onChange={(event) => setStatus(event.target.value)}>{RECRUITMENT_STATUSES.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><select aria-label={`${item.companyName} 事件可信度`} value={credibility} onChange={(event) => setCredibility(event.target.value)}>{CREDIBILITY_LEVELS.map((value) => <option key={value}>{value}</option>)}</select></td>
    <td><input aria-label={`${item.companyName} 事件来源`} value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="可空" /></td>
    <td><button className="table-save" disabled={pending} onClick={() => onUpdate(item.id, { eventType, eventDate: eventDate || null, status, credibility, sourceUrl })}>保存</button></td>
  </tr>;
}
