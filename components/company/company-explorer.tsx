"use client";

import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CompanyCard } from "@/components/company/company-card";
import type { CompanyCardData } from "@/lib/data";
import { COMPANY_CATEGORIES, JOB_DIRECTIONS, RECRUITMENT_STATUSES } from "@/lib/constants";
import { isCohortEvidence, isUsableLinkEvidence } from "@/lib/domain";

export type CompanyExplorerFilters = {
  query?: string;
  category?: string;
  status?: string;
  direction?: string;
  city?: string;
  hasOfficialLink?: string;
  sort?: string;
};

export function CompanyExplorer({
  companies,
  showSort = false,
  limit,
  mobileLimit,
  initialFilters = {},
}: {
  companies: CompanyCardData[];
  showSort?: boolean;
  limit?: number;
  mobileLimit?: number;
  initialFilters?: CompanyExplorerFilters;
}) {
  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [category, setCategory] = useState(initialFilters.category ?? "");
  const [status, setStatus] = useState(initialFilters.status ?? "");
  const [direction, setDirection] = useState(initialFilters.direction ?? "");
  const [city, setCity] = useState(initialFilters.city ?? "");
  const [hasOfficialLink, setHasOfficialLink] = useState(initialFilters.hasOfficialLink ?? "");
  const [sort, setSort] = useState(initialFilters.sort ?? "opportunity");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [effectiveLimit, setEffectiveLimit] = useState(limit);
  useEffect(() => {
    if (!mobileLimit || !limit) return;
    const media = window.matchMedia("(max-width: 680px)");
    const update = () => setEffectiveLimit(media.matches ? mobileLimit : limit);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [limit, mobileLimit]);
  const cities = useMemo(
    () =>
      [...new Set(companies.flatMap((company) => company.cities))].sort((a, b) =>
        a.localeCompare(b, "zh-CN"),
      ),
    [companies],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return companies
      .filter((company) => {
        const program = company.recruitments?.find((item) => item.targetYear === 2027);
        const hasUsableLink =
          company.links?.some((link) => link.isPrimary && isUsableLinkEvidence(link)) ?? false;
        const searchable = [
          company.name,
          company.shortName,
          ...company.cities,
          ...company.vehicleDirections,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!keyword || searchable.includes(keyword)) &&
          (!category || company.type === category) &&
          (!status || (program?.status ?? company.status) === status) &&
          (!direction || company.vehicleDirections.includes(direction)) &&
          (!city || company.cities.includes(city)) &&
          (!hasOfficialLink || hasUsableLink === (hasOfficialLink === "yes"))
        );
      })
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name, "zh-CN");
        if (sort === "status")
          return Number(Boolean(b.recruitments?.length)) - Number(Boolean(a.recruitments?.length));
        if (sort === "updated") return Date.parse(b.lastUpdatedAt) - Date.parse(a.lastUpdatedAt);
        const opportunity = (company: CompanyCardData) =>
          Number(
            Boolean(
              company.recruitments?.some(
                (item) => item.targetYear === 2027 && item.status.includes("开放"),
              ) && company.links?.some((link) => isCohortEvidence(link, 2027)),
            ),
          );
        const verified = (company: CompanyCardData) =>
          Math.max(
            0,
            ...(company.links ?? []).map((link) =>
              link.verifiedAt ? Date.parse(link.verifiedAt) : 0,
            ),
          );
        return (
          opportunity(b) - opportunity(a) ||
          verified(b) - verified(a) ||
          a.name.localeCompare(b.name, "zh-CN")
        );
      });
  }, [category, city, companies, direction, hasOfficialLink, query, sort, status]);

  const visible = effectiveLimit ? filtered.slice(0, effectiveLimit) : filtered;
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("type", category);
  if (status) params.set("status", status);
  if (direction) params.set("direction", direction);
  if (city) params.set("city", city);
  if (hasOfficialLink) params.set("official", hasOfficialLink);
  const fullListHref = params.size ? `/companies?${params}` : "/companies";

  return (
    <div className="explorer" data-testid="company-explorer">
      <div className="filter-panel">
        <label className="search-field">
          <Search size={18} />
          <input
            type="search"
            aria-label="搜索公司、城市或车辆方向"
            placeholder="搜索公司、城市或车辆方向"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="filter-grid">
          <label>
            <span>公司类型</span>
            <select
              aria-label="公司类型"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">全部类型</option>
              {COMPANY_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>届次</span>
            <select aria-label="届次" defaultValue="2027">
              <option value="2027">2027 届</option>
            </select>
          </label>
          <label>
            <span>车辆方向</span>
            <select
              aria-label="车辆方向"
              value={direction}
              onChange={(event) => setDirection(event.target.value)}
            >
              <option value="">全部方向</option>
              {JOB_DIRECTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          {showSort && (
            <label>
              <span>排序</span>
              <select
                aria-label="排序方式"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="opportunity">明确开放优先</option>
                <option value="updated">最近更新</option>
                <option value="name">公司名称</option>
              </select>
            </label>
          )}
        </div>
        <button
          aria-expanded={advancedOpen}
          className="advanced-toggle"
          type="button"
          onClick={() => setAdvancedOpen((value) => !value)}
        >
          {advancedOpen ? "收起高级筛选" : "高级筛选"}
        </button>
        {advancedOpen && (
          <div className="advanced-filter-grid">
            <label>
              <span>2027 状态</span>
              <select
                aria-label="2027 状态"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">全部状态</option>
                {RECRUITMENT_STATUSES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>城市</span>
              <select
                aria-label="城市"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">全部城市</option>
                {cities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>链接状态</span>
              <select
                aria-label="链接状态"
                value={hasOfficialLink}
                onChange={(event) => setHasOfficialLink(event.target.value)}
              >
                <option value="">全部</option>
                <option value="yes">有可用入口</option>
                <option value="no">需人工复核</option>
              </select>
            </label>
          </div>
        )}
      </div>
      <div className="result-bar">
        <span>
          <SlidersHorizontal size={16} />
          匹配 {filtered.length} 家企业
        </span>
        {(query || category || status || direction || city || hasOfficialLink) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setStatus("");
              setDirection("");
              setCity("");
              setHasOfficialLink("");
            }}
          >
            清除筛选
          </button>
        )}
      </div>
      <div className="company-list">
        {visible.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      {!visible.length && (
        <div className="data-state">
          <strong>没有匹配结果</strong>
          <p>减少筛选条件或更换关键词。</p>
        </div>
      )}
      {effectiveLimit && filtered.length > 0 && (
        <div className="section-actions">
          <Link className="button button-primary" href={fullListHref}>
            查看全部 {filtered.length} 家企业
          </Link>
        </div>
      )}
    </div>
  );
}
