"use client";

import { BookOpen, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ResourceData, CompanyCardData } from "@/lib/data";
import { RESOURCE_TYPES } from "@/lib/constants";
import { ExternalLink } from "@/components/ui/external-link";

type Item = ResourceData & { company: CompanyCardData | null };
const DIRECTIONS = ["自动驾驶", "嵌入式", "底盘", "整车研发", "三电", "电池", "热管理", "智能座舱", "测试验证"];

export function ResourceExplorer({ resources }: { resources: Item[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return resources.filter((item) => {
      const text = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return (!keyword || text.includes(keyword))
        && (!type || item.type === type)
        && (!direction || text.includes(direction.toLowerCase()));
    });
  }, [direction, query, resources, type]);

  return (
    <>
      <div className="resource-notice">
        <BookOpen size={19} />
        <div><strong>公共方法资料，不代表任何企业题库</strong><p>当前资料由平台整理，用于建立复习框架；没有外部来源时不会显示可点击按钮。</p></div>
      </div>
      <div className="filter-panel resource-filters">
        <div className="direction-tabs" aria-label="车辆方向资料分组">
          <button className={!direction ? "active" : ""} type="button" onClick={() => setDirection("")}>全部方向</button>
          {DIRECTIONS.map((item) => <button className={direction === item ? "active" : ""} key={item} type="button" onClick={() => setDirection(item)}>{item}</button>)}
        </div>
        <div className="resource-filter-grid">
          <label className="search-field"><Search size={17} /><input aria-label="搜索资料" placeholder="搜索知识点或方向" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <label><span>资料类型</span><select aria-label="资料类型" value={type} onChange={(event) => setType(event.target.value)}><option value="">全部类型</option>{RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className="button button-secondary" type="button" onClick={() => { setQuery(""); setType(""); setDirection(""); }}><RotateCcw size={15} />重置</button>
        </div>
      </div>
      <div className="resource-list">
        {filtered.map((item, index) => (
          <article className="resource-row" data-testid="resource-row" key={item.id}>
            <span className="resource-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="resource-content">
              <p>{item.type} · {item.source}</p>
              <h2>{item.title}</h2>
              <span>{item.summary}</span>
              <div className="tag-row">{item.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
            </div>
            <div className="resource-source">
              <strong>{item.credibility}</strong>
              <ExternalLink href={item.sourceUrl} emptyLabel="暂无外部来源">查看来源</ExternalLink>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && <div className="data-state"><strong>暂无匹配资料</strong><p>调整方向、类型或搜索关键词。</p></div>}
    </>
  );
}
