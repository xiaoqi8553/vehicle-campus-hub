"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  Clock3,
  FileQuestion,
  Link2,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { ResourceData, CompanyCardData } from "@/lib/data";
import { CREDIBILITY_LEVELS, RESOURCE_TYPES } from "@/lib/constants";
import { ExternalLink } from "@/components/ui/external-link";
import { safeExternalUrl } from "@/lib/domain";

type Item = ResourceData & { company: CompanyCardData };
type SortMode = "recent" | "official" | "company";

const RESOURCE_DIRECTIONS = [
  "自动驾驶",
  "嵌入式",
  "底盘",
  "整车研发",
  "三电",
  "电池",
  "热管理",
  "智能座舱",
  "测试验证",
];

const credibilityTone: Record<string, string> = {
  官方: "official",
  较可信: "trusted",
  经验参考: "experience",
  待核实: "pending",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function ResourceExplorer({ resources }: { resources: Item[] }) {
  const [query, setQuery] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [type, setType] = useState("");
  const [credibility, setCredibility] = useState("");
  const [direction, setDirection] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const companies = useMemo(
    () => [...new Map(resources.map((item) => [item.company.id, item.company])).values()]
      .sort((a, b) => a.name.localeCompare(b.name, "zh-CN")),
    [resources],
  );
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return resources
      .filter((item) => (
        (!keyword || `${item.title} ${item.summary} ${item.source} ${item.company.name} ${item.tags.join(" ")}`.toLowerCase().includes(keyword))
        && (!companyId || item.companyId === companyId)
        && (!type || item.type === type)
        && (!credibility || item.credibility === credibility)
        && (!direction || `${item.title} ${item.summary} ${item.tags.join(" ")}`.includes(direction))
      ))
      .sort((a, b) => {
        if (sortMode === "company") {
          return a.company.name.localeCompare(b.company.name, "zh-CN");
        }
        if (sortMode === "official") {
          const credibilityOrder: Record<string, number> = {
            官方: 0,
            较可信: 1,
            经验参考: 2,
            待核实: 3,
          };
          return (credibilityOrder[a.credibility] ?? 4) - (credibilityOrder[b.credibility] ?? 4)
            || Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
        }
        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      });
  }, [companyId, credibility, direction, query, resources, sortMode, type]);

  const officialCount = resources.filter((item) => item.credibility === "官方").length;
  const validLinkCount = resources.filter((item) => safeExternalUrl(item.url)).length;
  const latestUpdatedAt = resources.reduce(
    (latest, item) => Date.parse(item.updatedAt) > Date.parse(latest) ? item.updatedAt : latest,
    resources[0]?.updatedAt ?? new Date(0).toISOString(),
  );
  const hasFilters = Boolean(query || companyId || type || credibility || direction);

  function clearFilters() {
    setQuery("");
    setCompanyId("");
    setType("");
    setCredibility("");
    setDirection("");
  }

  return (
    <>
      <div className="resource-notice" role="note">
        <ShieldCheck size={19} />
        <div>
          <strong>2027届资料库仍在补链接，具体以企业官方信息为准</strong>
          <p>官方入口仅保留已核验域名；候选人经验用于准备参考，不代表企业题库或官方口径。</p>
        </div>
      </div>

      <section className="resource-stats" data-testid="resource-stats" aria-label="资源统计">
        <article><BookOpen size={18} /><span>收录资料<strong>{resources.length}</strong></span></article>
        <article><BadgeCheck size={18} /><span>官方资料<strong>{officialCount}</strong></span></article>
        <article><Link2 size={18} /><span>有效外链<strong>{validLinkCount}</strong></span></article>
        <article><Clock3 size={18} /><span>最近更新<strong>{formatDate(latestUpdatedAt)}</strong></span></article>
      </section>

      <div className="filter-panel resource-filters">
        <div className="direction-tabs" aria-label="车辆方向资料分组">
          <button className={!direction ? "active" : ""} type="button" onClick={() => setDirection("")}>全部方向</button>
          {RESOURCE_DIRECTIONS.map((item) => (
            <button className={direction === item ? "active" : ""} key={item} type="button" onClick={() => setDirection(item)}>
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="搜索资料"
            placeholder="搜索资料关键词"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="filter-grid">
          <label><span>公司</span><select aria-label="公司" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">全部公司</option>
            {companies.map((company) => <option value={company.id} key={company.id}>{company.name}</option>)}
          </select></label>
          <label><span>资料类型</span><select aria-label="资料类型" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">全部类型</option>{RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select></label>
          <label><span>可信度</span><select aria-label="可信度" value={credibility} onChange={(e) => setCredibility(e.target.value)}>
            <option value="">全部可信度</option>{CREDIBILITY_LEVELS.map((item) => <option key={item}>{item}</option>)}
          </select></label>
          <label><span>排序</span><select aria-label="排序方式" value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
            <option value="recent">最近更新</option>
            <option value="official">官方优先</option>
            <option value="company">按公司名称</option>
          </select></label>
        </div>
        <div className="resource-filter-actions">
          <p>当前显示 <strong>{filtered.length}</strong> / {resources.length} 份资料</p>
          <div>
            <button
              className={`filter-chip ${credibility === "官方" ? "active" : ""}`}
              type="button"
              onClick={() => setCredibility(credibility === "官方" ? "" : "官方")}
            >
              <BadgeCheck size={15} />
              {credibility === "官方" ? "查看全部资料" : "只看官方资料"}
            </button>
            {hasFilters && (
              <button className="filter-reset" type="button" onClick={clearFilters}>
                <RotateCcw size={14} />清除筛选
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="resource-grid">
        {filtered.map((item) => {
          const tone = credibilityTone[item.credibility] ?? "pending";
          return (
          <article className={`resource-card resource-card-${tone}`} data-testid="resource-card" key={item.id}>
            <div className="resource-icon"><BookOpen size={21} /></div>
            <div className="resource-heading">
              <span className="tag">{item.type}</span>
              <span className={`credibility credibility-${tone}`}>
                <i />
                {item.credibility}
              </span>
            </div>
            <h3>{item.title}</h3>
            <p className="resource-company">{item.company.name} · {item.source}</p>
            <p>{item.summary}</p>
            <div className="tag-row">
              {item.tags.slice(0, 4).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
            <div className="resource-meta">
              <span>{item.targetYear}届 · 来源年份 {item.sourceYear} · {item.sourceType}</span>
              <time dateTime={item.updatedAt}>更新于 {formatDate(item.updatedAt)}</time>
            </div>
            <ExternalLink href={item.sourceUrl} emptyLabel="暂无链接，待补充">查看资料</ExternalLink>
          </article>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="data-state resource-empty">
          <FileQuestion size={30} />
          <strong>暂无匹配资料</strong>
          <p>请调整关键词或筛选条件，也可以一键恢复全部资源。</p>
          <button className="button button-primary" type="button" onClick={clearFilters}>清除筛选</button>
        </div>
      )}
    </>
  );
}
