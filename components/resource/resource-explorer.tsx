"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import type { ResourceData, CompanyCardData } from "@/lib/data";
import { CREDIBILITY_LEVELS, RESOURCE_TYPES } from "@/lib/constants";
import { ExternalLink } from "@/components/ui/external-link";

type Item = ResourceData & { company: CompanyCardData };

export function ResourceExplorer({ resources }: { resources: Item[] }) {
  const [query, setQuery] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [type, setType] = useState("");
  const [credibility, setCredibility] = useState("");
  const companies = useMemo(
    () => [...new Map(resources.map((item) => [item.company.id, item.company])).values()],
    [resources],
  );
  const filtered = resources.filter((item) => {
    const keyword = query.trim().toLowerCase();
    return (!keyword || `${item.title} ${item.summary} ${item.company.name}`.toLowerCase().includes(keyword))
      && (!companyId || item.companyId === companyId)
      && (!type || item.type === type)
      && (!credibility || item.credibility === credibility);
  });

  return (
    <>
      <div className="filter-panel resource-filters">
        <label className="search-field">
          <Search size={18} />
          <input placeholder="搜索资料关键词" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="filter-grid">
          <label><span>公司</span><select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">全部公司</option>
            {companies.map((company) => <option value={company.id} key={company.id}>{company.name}</option>)}
          </select></label>
          <label><span>资料类型</span><select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">全部类型</option>{RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select></label>
          <label><span>可信度</span><select value={credibility} onChange={(e) => setCredibility(e.target.value)}>
            <option value="">全部可信度</option>{CREDIBILITY_LEVELS.map((item) => <option key={item}>{item}</option>)}
          </select></label>
        </div>
      </div>
      <div className="resource-grid">
        {filtered.map((item) => (
          <article className="resource-card" data-testid="resource-card" key={item.id}>
            <div className="resource-icon"><BookOpen size={21} /></div>
            <div className="resource-heading">
              <span className="tag">{item.type}</span>
              <span className={`credibility credibility-${item.credibility}`}>{item.credibility}</span>
            </div>
            <h3>{item.title}</h3>
            <p className="resource-company">{item.company.name} · {item.source}</p>
            <p>{item.summary}</p>
            <ExternalLink href={item.url} emptyLabel="暂无外部链接">查看资料</ExternalLink>
          </article>
        ))}
      </div>
      {!filtered.length && <div className="data-state"><strong>暂无匹配资料</strong><p>请调整搜索或筛选条件。</p></div>}
    </>
  );
}
