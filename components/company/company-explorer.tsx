"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CompanyCard } from "@/components/company/company-card";
import type { CompanyCardData } from "@/lib/data";
import { COMPANY_CATEGORIES, JOB_DIRECTIONS, RECRUITMENT_STATUSES } from "@/lib/constants";

export function CompanyExplorer({
  companies,
  showSort = false,
}: {
  companies: CompanyCardData[];
  showSort?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState("");
  const [sort, setSort] = useState("updated");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return companies
      .filter((company) => {
        const haystack = [
          company.name,
          ...company.cities,
          ...company.tags,
          ...company.fitDirections,
        ].join(" ").toLowerCase();
        return (!keyword || haystack.includes(keyword))
          && (!category || company.category === category)
          && (!status || company.status === status)
          && (!direction || company.fitDirections.includes(direction));
      })
      .sort((a, b) => {
        if (sort === "status") return Number(b.status === "已开启") - Number(a.status === "已开启");
        if (sort === "fit") return b.fitDirections.length - a.fitDirections.length;
        if (sort === "name") return a.name.localeCompare(b.name, "zh-CN");
        return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
      });
  }, [category, companies, direction, query, sort, status]);

  return (
    <div className="explorer">
      <div className="filter-panel">
        <label className="search-field">
          <Search size={18} />
          <input
            placeholder="搜索公司、岗位方向、城市或标签"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="filter-grid">
          <label>
            <span>公司类型</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">全部类型</option>
              {COMPANY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>校招状态</span>
            <select aria-label="校招状态" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">全部状态</option>
              {RECRUITMENT_STATUSES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>岗位方向</span>
            <select value={direction} onChange={(event) => setDirection(event.target.value)}>
              <option value="">全部方向</option>
              {JOB_DIRECTIONS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          {showSort && (
            <label>
              <span>排序方式</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="updated">最近更新</option>
                <option value="status">校招已开启优先</option>
                <option value="fit">方向适配优先</option>
                <option value="name">公司名称</option>
              </select>
            </label>
          )}
        </div>
      </div>
      <div className="result-bar">
        <span><SlidersHorizontal size={16} />匹配 {filtered.length} 家企业</span>
        {(query || category || status || direction) && (
          <button type="button" onClick={() => {
            setQuery(""); setCategory(""); setStatus(""); setDirection("");
          }}>清除筛选</button>
        )}
      </div>
      {filtered.length ? (
        <div className="company-grid">
          {filtered.map((company) => <CompanyCard key={company.id} company={company} />)}
        </div>
      ) : (
        <div className="data-state"><strong>没有匹配结果</strong><p>尝试减少筛选条件或更换关键词。</p></div>
      )}
    </div>
  );
}
