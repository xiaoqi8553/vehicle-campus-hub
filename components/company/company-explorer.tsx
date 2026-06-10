"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CompanyCard } from "@/components/company/company-card";
import type { CompanyCardData } from "@/lib/data";
import { COMPANY_CATEGORIES, CREDIBILITY_LEVELS, JOB_DIRECTIONS, RECRUITMENT_STATUSES } from "@/lib/constants";
import { safeExternalUrl } from "@/lib/domain";

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
  const [city, setCity] = useState("");
  const [credibility, setCredibility] = useState("");
  const [hasOfficialLink, setHasOfficialLink] = useState("");
  const [sort, setSort] = useState("updated");
  const cities = useMemo(
    () => [...new Set(companies.flatMap((company) => company.cities))].sort((a, b) => a.localeCompare(b, "zh-CN")),
    [companies],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return companies
      .filter((company) => {
        const program = company.recruitments?.[0];
        const applyUrl = safeExternalUrl(program?.applyUrl ?? company.campusRecruitmentWebsite);
        const haystack = [
          company.name,
          company.shortName,
          ...company.cities,
          ...company.tags,
          ...company.vehicleDirections,
        ].join(" ").toLowerCase();
        return (!keyword || haystack.includes(keyword))
          && (!category || company.type === category)
          && (!status || (program?.status ?? company.status) === status)
          && (!direction || company.vehicleDirections.includes(direction))
          && (!city || company.cities.includes(city))
          && (!credibility || program?.credibility === credibility)
          && (!hasOfficialLink || Boolean(applyUrl) === (hasOfficialLink === "yes"));
      })
      .sort((a, b) => {
        const aProgram = a.recruitments?.[0];
        const bProgram = b.recruitments?.[0];
        if (sort === "deadline") {
          const aTime = aProgram?.endDate ? Date.parse(aProgram.endDate) : Number.MAX_SAFE_INTEGER;
          const bTime = bProgram?.endDate ? Date.parse(bProgram.endDate) : Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        }
        if (sort === "status") return Number((bProgram?.status ?? b.status) === "已开启") - Number((aProgram?.status ?? a.status) === "已开启");
        if (sort === "verified") return Number(b.dataStatus === "已核验") - Number(a.dataStatus === "已核验");
        if (sort === "fit") return b.vehicleDirections.length - a.vehicleDirections.length;
        if (sort === "name") return a.name.localeCompare(b.name, "zh-CN");
        return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
      });
  }, [category, city, companies, credibility, direction, hasOfficialLink, query, sort, status]);

  return (
    <div className="explorer" data-testid="company-explorer">
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
          <label>
            <span>城市</span>
            <select aria-label="城市" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="">全部城市</option>
              {cities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>可信度</span>
            <select aria-label="可信度" value={credibility} onChange={(event) => setCredibility(event.target.value)}>
              <option value="">全部可信度</option>
              {CREDIBILITY_LEVELS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>官方投递链接</span>
            <select aria-label="是否有官方投递链接" value={hasOfficialLink} onChange={(event) => setHasOfficialLink(event.target.value)}>
              <option value="">全部</option>
              <option value="yes">有官方链接</option>
              <option value="no">待补官方链接</option>
            </select>
          </label>
          {showSort && (
            <label>
              <span>排序方式</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="updated">最近更新</option>
                <option value="deadline">即将截止</option>
                <option value="status">校招已开启优先</option>
                <option value="verified">官方已核验优先</option>
                <option value="fit">方向适配优先</option>
                <option value="name">公司名称</option>
              </select>
            </label>
          )}
        </div>
      </div>
      <div className="result-bar">
        <span><SlidersHorizontal size={16} />匹配 {filtered.length} 家企业</span>
        {(query || category || status || direction || city || credibility || hasOfficialLink) && (
          <button type="button" onClick={() => {
            setQuery(""); setCategory(""); setStatus(""); setDirection(""); setCity(""); setCredibility(""); setHasOfficialLink("");
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
