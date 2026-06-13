"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { CompanyCardData, ResourceData } from "@/lib/data";
import { RESOURCE_TYPES } from "@/lib/constants";

type Item = ResourceData & { company: CompanyCardData | null };

const DIRECTIONS = [
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

export function ResourceExplorer({ resources }: { resources: Item[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return resources.filter((item) => {
      const text = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return (
        (!keyword || text.includes(keyword)) &&
        (!type || item.type === type) &&
        (!direction || text.includes(direction.toLowerCase()))
      );
    });
  }, [direction, query, resources, type]);
  const [featured, ...rest] = filtered;

  return (
    <div className="guide-explorer">
      <div className="guide-filter-panel">
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="搜索求职指南"
            placeholder="搜索知识点、技术方向或面试主题"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="direction-tabs" aria-label="车辆方向资料分组">
          <button
            className={!direction ? "active" : ""}
            type="button"
            onClick={() => setDirection("")}
          >
            全部方向
          </button>
          {DIRECTIONS.map((item) => (
            <button
              className={direction === item ? "active" : ""}
              key={item}
              type="button"
              onClick={() => setDirection(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="resource-filter-grid">
          <label>
            <span>资料类型</span>
            <select
              aria-label="资料类型"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">全部类型</option>
              {RESOURCE_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setType("");
              setDirection("");
            }}
          >
            <RotateCcw size={15} />
            重置筛选
          </button>
        </div>
      </div>

      {featured ? (
        <article className="featured-guide" data-testid="resource-row">
          <div>
            <span className="guide-origin">平台整理</span>
            <p className="page-kicker">推荐先读</p>
            <h2>车辆行业校招准备路线图</h2>
            <p>从岗位方向、简历项目、笔试知识点到面试复盘，先用一篇完整指南建立准备顺序。</p>
            <div className="tag-row">
              {featured.tags.slice(0, 4).map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/resources/${featured.id}`} aria-label={`阅读完整指南：${featured.title}`}>
              阅读完整指南
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="featured-guide-visual" aria-hidden="true">
            <span>01</span>
            <span>02</span>
            <span>03</span>
            <BookOpen size={34} />
          </div>
          <h3 className="sr-only">{featured.title}</h3>
        </article>
      ) : null}

      {rest.length ? (
        <section className="guide-list-section">
          <div className="section-title">
            <div>
              <p className="page-kicker">按主题阅读</p>
              <h2>继续完善你的准备清单</h2>
            </div>
          </div>
          <div className="guide-card-grid">
            {rest.map((item) => (
              <article className="guide-card" data-testid="resource-row" key={item.id}>
                <span className="guide-origin">平台整理</span>
                <p>{item.type}</p>
                <h2>{item.title}</h2>
                <span>{item.summary}</span>
                <div className="tag-row">
                  {item.tags.slice(0, 4).map((tag) => (
                    <i key={tag}>{tag}</i>
                  ))}
                </div>
                <div className="guide-card-footer">
                  <small>
                    <Clock3 size={14} />
                    {item.content.length} 个章节
                  </small>
                  <Link href={`/resources/${item.id}`} aria-label={`阅读完整指南：${item.title}`}>
                    阅读完整指南
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!filtered.length ? (
        <div className="data-state">
          <strong>暂无匹配指南</strong>
          <p>调整方向、类型或搜索关键词。</p>
        </div>
      ) : null}
    </div>
  );
}
