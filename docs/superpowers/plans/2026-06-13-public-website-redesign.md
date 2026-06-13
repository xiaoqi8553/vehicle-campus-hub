# 车招雷达公众官网重塑实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Vehicle Campus Hub 的工程台账式界面重塑为面向 2027 届学生的“车招雷达”公众求职官网，同时保留现有真实数据、链接证据规则和生产安全边界。

**Architecture:** 保留 Next.js App Router、Prisma 数据层和现有序列化展示模型，只重构页面组合、公共组件、公众文案和 CSS 设计系统。服务端页面继续负责数据读取，客户端 Explorer 仅负责筛选和排序；所有外链仍通过现有领域规则判断可用性。Playwright 先固定新品牌、页面职责、移动端数量和可访问性，再逐页实现。

**Tech Stack:** Next.js 15、React 19、TypeScript、Prisma 6、PostgreSQL、Lucide React、CSS、Vitest、Playwright

---

## 文件结构

### 新建

- `components/brand/brand-mark.tsx`：公众品牌图形，不依赖外部图片。
- `components/ui/page-hero.tsx`：内页统一标题、说明与可选统计。
- `components/home/radar-visual.tsx`：首页桌面雷达装饰，移动端隐藏。
- `components/home/opportunity-card.tsx`：首页最多三条明确机会。
- `components/home/update-feed.tsx`：最近真实变化。
- `components/ui/direction-card.tsx`：技术方向入口。
- `components/ui/feedback-callout.tsx`：统一真实反馈入口。
- `tests/e2e/public-site.spec.ts`：新公众品牌与信息架构契约。
- `docs/redesign/2026-06-13/`：最终桌面和移动端截图。

### 修改

- `app/layout.tsx`：品牌 Metadata、跳转链接与全局布局。
- `app/globals.css`：替换旧工程台账视觉，保留后台必要兼容样式。
- `app/page.tsx`：新首页信息架构。
- `app/companies/page.tsx`：公众化公司机会页。
- `app/companies/[id]/page.tsx`：公司机会判断页。
- `app/calendar/page.tsx`：真实日历与紧凑观察名单。
- `app/resources/page.tsx`：求职指南入口。
- `app/resources/[id]/page.tsx`：文章阅读体验。
- `app/about/page.tsx`：公众品牌、来源原则、反馈和免责声明。
- `components/layout/site-header.tsx`：车招雷达品牌与公众导航。
- `components/layout/site-footer.tsx`：公众页脚，不硬编码版本。
- `components/company/company-card.tsx`：公司比较列表。
- `components/company/company-explorer.tsx`：公众筛选条与搜索文案。
- `components/company/company-link.tsx`：明确主按钮和来源元数据。
- `components/resource/resource-explorer.tsx`：精选指南与方向列表。
- `components/ui/status-badge.tsx`：学生可理解的状态样式。
- `tests/e2e/main.spec.ts`
- `tests/e2e/redesign.spec.ts`
- `tests/e2e/trust.spec.ts`
- `tests/e2e/resources.spec.ts`
- `tests/e2e/visual.spec.ts`
- `CHANGELOG.md`
- `REDESIGN_REPORT.md`
- `TEST_REPORT.md`

## Task 1：固定公众品牌与全站测试契约

**Files:**

- Create: `tests/e2e/public-site.spec.ts`
- Modify: `tests/e2e/main.spec.ts`
- Modify: `tests/e2e/redesign.spec.ts`

- [ ] **Step 1: 写入失败的公众品牌测试**

```ts
import { expect, test } from "@playwright/test";

test("public site uses the CheZhao Radar brand and student-facing navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "车招雷达首页" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "更快找到适合你的车企机会" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "主导航" })).toContainText([
    "公司机会",
    "招聘日历",
    "求职指南",
    "关于我们",
  ]);
  await expect(page.getByText(/EVIDENCE DOSSIER|SEARCH FIRST|DECISION SUMMARY/)).toHaveCount(0);
});

test("each public page has a distinct student-facing purpose", async ({ page }) => {
  const routes = [
    ["/companies", "寻找适合你的车辆企业"],
    ["/calendar", "车辆行业校招日历"],
    ["/resources", "车辆行业求职指南"],
    ["/about", "让车辆行业校招信息，更容易找到，也更容易相信"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});
```

- [ ] **Step 2: 运行测试并确认因旧品牌失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts --project=chromium`

Expected: FAIL，首页找不到“车招雷达首页”和新 H1。

- [ ] **Step 3: 更新旧测试中的公众文案契约**

将以下断言统一替换：

```ts
await expect(page.getByRole("heading", { name: "更快找到适合你的车企机会" })).toBeVisible();
await expect(page.getByRole("heading", { name: "寻找适合你的车辆企业" })).toBeVisible();
await expect(page.getByRole("heading", { name: "车辆行业校招日历" })).toBeVisible();
await expect(page.getByRole("heading", { name: "车辆行业求职指南" })).toBeVisible();
await expect(page.getByRole("link", { name: "了解小米汽车机会" })).toBeVisible();
```

保留公司数量、失效链接、事件去重和资源正文等现有行为断言。

- [ ] **Step 4: 提交测试契约**

```bash
git add tests/e2e/public-site.spec.ts tests/e2e/main.spec.ts tests/e2e/redesign.spec.ts
git commit -m "test: define public website experience"
```

## Task 2：建立公众设计系统和全局品牌

**Files:**

- Create: `components/brand/brand-mark.tsx`
- Create: `components/ui/page-hero.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `components/layout/site-footer.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: 实现可复用品牌图形**

```tsx
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-symbol brand-symbol-compact" : "brand-symbol"} aria-hidden>
      <span />
      <i />
    </span>
  );
}
```

- [ ] **Step 2: 实现内页标题组件**

```tsx
export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="page-hero">
      <div>
        <p className="page-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {aside && <div className="page-hero-aside">{aside}</div>}
    </header>
  );
}
```

- [ ] **Step 3: 替换公众导航和 Metadata**

`site-header.tsx` 使用：

```tsx
const navItems = [
  { href: "/companies", label: "公司机会" },
  { href: "/calendar", label: "招聘日历" },
  { href: "/resources", label: "求职指南" },
  { href: "/about", label: "关于我们" },
];
```

品牌链接：

```tsx
<Link href="/" className="site-brand" aria-label="车招雷达首页">
  <BrandMark />
  <span>
    <strong>车招雷达</strong>
    <small>Vehicle Campus Hub</small>
  </span>
</Link>
```

`app/layout.tsx` Metadata：

```ts
export const metadata: Metadata = {
  title: {
    default: "车招雷达 | 2027届车辆行业校招",
    template: "%s | 车招雷达",
  },
  description: "聚合车辆行业官方招聘入口、校招进度、技术方向和求职指南。",
};
```

- [ ] **Step 4: 重建 CSS 设计令牌**

在 `app/globals.css` 顶部定义：

```css
:root {
  --color-primary: #215ee8;
  --color-primary-strong: #1748bd;
  --color-ink: #12203a;
  --color-muted: #68758c;
  --color-page: #fbfcff;
  --color-surface: #ffffff;
  --color-soft: #f5f8ff;
  --color-line: #e2e8f2;
  --color-success: #0d9768;
  --color-warning: #d98224;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --shadow-soft: 0 16px 45px rgba(30, 59, 112, 0.1);
}
```

删除旧 `--navy`、`--orange`、网格纸背景和 `terminal-*` 视觉依赖。保留后台页面所需类名，但将后台规则放到文件末尾独立区域。

- [ ] **Step 5: 运行品牌测试**

Run: `npx playwright test tests/e2e/public-site.spec.ts --project=chromium`

Expected: 首页品牌测试仍可能因页面 H1 未改失败，但导航和 Metadata 相关断言通过。

- [ ] **Step 6: 提交全局设计系统**

```bash
git add app/layout.tsx app/globals.css components/brand/brand-mark.tsx components/ui/page-hero.tsx components/layout/site-header.tsx components/layout/site-footer.tsx
git commit -m "feat: establish CheZhao Radar design system"
```

## Task 3：重构首页为搜索优先的机会发现页

**Files:**

- Create: `components/home/radar-visual.tsx`
- Create: `components/home/opportunity-card.tsx`
- Create: `components/home/update-feed.tsx`
- Create: `components/ui/direction-card.tsx`
- Modify: `app/page.tsx`
- Modify: `components/company/company-explorer.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/public-site.spec.ts`
- Test: `tests/e2e/trust.spec.ts`

- [ ] **Step 1: 添加失败的首页结构测试**

```ts
test("homepage prioritizes search, three real opportunities and direction discovery", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("searchbox", { name: "搜索公司、技术方向或城市" })).toBeVisible();
  await expect(page.getByTestId("home-opportunity")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "按车辆技术方向找机会" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "每条机会，都说明信息从哪里来" })).toBeVisible();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts -g "homepage prioritizes" --project=chromium`

Expected: FAIL，新 H1、搜索名称和 `home-opportunity` 不存在。

- [ ] **Step 3: 实现首页机会卡**

```tsx
export function OpportunityCard({ company, program }: Props) {
  return (
    <article className="opportunity-card" data-testid="home-opportunity">
      <div className="opportunity-card-top">
        <span className="company-avatar">{company.shortName.slice(0, 1)}</span>
        <StatusBadge status="正在招聘" />
      </div>
      <h3>{company.name}</h3>
      <p className="company-meta">
        {company.type} · {company.cities.join(" / ")}
      </p>
      <strong>{program.title}</strong>
      <div className="chip-list">
        {company.vehicleDirections.slice(0, 3).map((direction) => (
          <span key={direction}>{direction}</span>
        ))}
      </div>
      <div className="opportunity-card-footer">
        <CompanyLinkAction
          companyName={company.name}
          link={program.sourceLink}
          className="text-link"
        />
        <small>{formatPublicDate(program.verifiedAt)}核验</small>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: 重组首页**

`app/page.tsx` 使用固定顺序：

```tsx
<>
  <section className="home-hero">...</section>
  <section className="shell home-metrics">...</section>
  <section className="shell section-block">重点机会，最多 3 条</section>
  <section className="shell section-block home-insights">最近变化 + 新手引导</section>
  <section className="shell section-block">技术方向</section>
  <section className="shell verification-callout">核验说明</section>
</>
```

首页不再渲染完整 `CompanyExplorer`。搜索表单将关键词提交到 `/companies?q=...`，快捷方向链接提交到 `/companies?direction=...`。

- [ ] **Step 5: 验证首页**

Run: `npx playwright test tests/e2e/public-site.spec.ts tests/e2e/trust.spec.ts --project=chromium`

Expected: 首页新结构通过，移动端公司数量契约改为 3 条重点机会。

- [ ] **Step 6: 提交首页**

```bash
git add app/page.tsx app/globals.css components/home components/ui/direction-card.tsx tests/e2e/public-site.spec.ts tests/e2e/trust.spec.ts
git commit -m "feat: rebuild public opportunity homepage"
```

## Task 4：重构公司机会筛选与比较列表

**Files:**

- Modify: `app/companies/page.tsx`
- Modify: `components/company/company-explorer.tsx`
- Modify: `components/company/company-card.tsx`
- Modify: `components/company/company-link.tsx`
- Modify: `components/ui/status-badge.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/main.spec.ts`
- Test: `tests/e2e/public-site.spec.ts`

- [ ] **Step 1: 添加失败的公众公司列表测试**

```ts
test("company list communicates opportunity status without internal evidence jargon", async ({
  page,
}) => {
  await page.goto("/companies");
  await expect(page.getByTestId("company-row")).toHaveCount(25);
  await expect(page.getByText("找到 25 家企业")).toBeVisible();
  await expect(page.getByRole("link", { name: "了解小米汽车机会" })).toBeVisible();
  await expect(page.getByText(/证据档案|COMPANY INTELLIGENCE/)).toHaveCount(0);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts -g "company list communicates" --project=chromium`

Expected: FAIL，旧页面仍显示“公司情报库”和“证据档案”。

- [ ] **Step 3: 改造筛选条**

保留现有状态与排序逻辑，调整公开标签：

```tsx
<input aria-label="搜索公司、技术方向或城市" placeholder="搜索公司、技术方向或城市" />
<button className="more-filter-button">更多筛选</button>
<span>找到 {filtered.length} 家企业</span>
```

首页搜索参数继续使用 `q`、`type`、`direction`、`status`、`city` 和 `official`。

- [ ] **Step 4: 改造公司列表项**

状态转换：

```ts
const publicStatus = program ? "2027 项目已开放" : primaryLink ? "等待 2027 项目" : "信息待确认";
```

内部详情入口：

```tsx
<Link href={`/companies/${company.slug}`} aria-label={`了解${company.name}机会`}>
  了解公司机会
</Link>
```

不可用主入口使用 `<span>`，不渲染空 `href`。

- [ ] **Step 5: 验证搜索、排序和移动布局**

Run: `npx playwright test tests/e2e/main.spec.ts tests/e2e/public-site.spec.ts --project=chromium`

Expected: 25 家企业、搜索“小米”、开放机会前三名、无重复 URL 均通过。

- [ ] **Step 6: 提交公司列表**

```bash
git add app/companies/page.tsx components/company components/ui/status-badge.tsx app/globals.css tests/e2e/main.spec.ts tests/e2e/public-site.spec.ts
git commit -m "feat: redesign company opportunity explorer"
```

## Task 5：重构公司详情为机会判断页

**Files:**

- Modify: `app/companies/[id]/page.tsx`
- Create: `components/ui/feedback-callout.tsx`
- Modify: `components/company/company-link.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/public-site.spec.ts`
- Test: `tests/e2e/redesign.spec.ts`
- Test: `tests/e2e/trust.spec.ts`

- [ ] **Step 1: 添加失败的公司详情测试**

```ts
test("company detail answers what the student can do next", async ({ page }) => {
  await page.goto("/companies/xiaomi-auto");
  await expect(page.getByRole("heading", { name: "当前校招机会" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "适合关注的技术方向" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "现在可以做什么？" })).toBeVisible();
  await expect(page.getByText(/EVIDENCE DOSSIER|DECISION SUMMARY|下一步判断/)).toHaveCount(0);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts -g "company detail answers" --project=chromium`

Expected: FAIL，旧内部术语仍存在。

- [ ] **Step 3: 实现统一反馈组件**

```tsx
export function FeedbackCallout({ companyName }: { companyName?: string }) {
  const label = companyName ? `反馈${companyName}信息` : "提交信息反馈";
  return (
    <aside className="feedback-callout">
      <h2>发现信息有变化？</h2>
      <p>提交正确链接或官方公告，我们会在核验后更新。</p>
      <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" aria-label={label}>
        {label}
      </a>
    </aside>
  );
}
```

- [ ] **Step 4: 重组详情页**

页面结构：

```tsx
<header className="company-detail-hero">公司身份 + 状态 + 唯一主操作</header>
<div className="company-detail-layout">
  <main>
    <section>当前校招机会</section>
    <section>适合关注的技术方向</section>
    <section>官方来源与核验记录</section>
    <section>常见问题</section>
  </main>
  <aside>
    <section className="quick-answer">现在可以做什么？</section>
    <FeedbackCallout companyName={company.name} />
  </aside>
</div>
```

保留失效 `/campus/0` 的非点击记录，并继续去重主链接与来源链接。

- [ ] **Step 5: 验证公司详情可信度规则**

Run: `npx playwright test tests/e2e/redesign.spec.ts tests/e2e/trust.spec.ts tests/e2e/public-site.spec.ts --project=chromium`

Expected: 失效深链不可点击、外链名称具体、无数字匹配分数、新公众标题通过。

- [ ] **Step 6: 提交公司详情**

```bash
git add app/companies/[id]/page.tsx components/ui/feedback-callout.tsx components/company/company-link.tsx app/globals.css tests/e2e
git commit -m "feat: turn company detail into opportunity guide"
```

## Task 6：重构招聘日历

**Files:**

- Modify: `app/calendar/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/trust.spec.ts`
- Test: `tests/e2e/public-site.spec.ts`

- [ ] **Step 1: 添加失败的紧凑观察名单测试**

```ts
test("calendar keeps unpublished companies behind one compact watchlist entry", async ({
  page,
}) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("open-undated-row")).toHaveCount(3);
  await expect(page.getByTestId("watchlist-row")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "查看企业观察名单" })).toBeVisible();
  await expect(page.locator("time")).toHaveCount(0);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts -g "calendar keeps" --project=chromium`

Expected: FAIL，旧页面仍渲染 22 条 `watchlist-row`。

- [ ] **Step 3: 重构日历页面**

保留 `openUndated` 和 `unpublished` 计算，删除 22 行表格，替换为：

```tsx
<aside className="calendar-watchlist-callout">
  <div>
    <strong>还有 {unpublished.length} 家企业尚未发布明确的 2027 届项目</strong>
    <p>它们仍在跟踪列表中，但不会在日历里重复显示相同的待确认记录。</p>
  </div>
  <Link href="/companies?status=待确认">查看企业观察名单</Link>
</aside>
```

明确日期区域在数据为空时显示一条友好空状态。

- [ ] **Step 4: 验证日历去重与日期规则**

Run: `npx playwright test tests/e2e/trust.spec.ts tests/e2e/public-site.spec.ts --project=chromium`

Expected: 3 个无截止项目、0 个伪日期、0 个重复观察行、失效深链不可点击。

- [ ] **Step 5: 提交日历**

```bash
git add app/calendar/page.tsx app/globals.css tests/e2e/trust.spec.ts tests/e2e/public-site.spec.ts
git commit -m "feat: simplify verified recruitment calendar"
```

## Task 7：重构求职指南与文章页

**Files:**

- Modify: `app/resources/page.tsx`
- Modify: `app/resources/[id]/page.tsx`
- Modify: `components/resource/resource-explorer.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/resources.spec.ts`
- Test: `tests/e2e/public-site.spec.ts`

- [ ] **Step 1: 添加失败的求职指南测试**

```ts
test("career guides present complete reading paths instead of resource inventory", async ({
  page,
}) => {
  await page.goto("/resources");
  await expect(page.getByRole("heading", { name: "车辆行业求职指南" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "车辆行业校招准备路线图" })).toBeVisible();
  await expect(page.getByRole("link", { name: /阅读完整指南/ })).toBeVisible();
  await expect(page.getByTestId("resource-row")).toHaveCount(6);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts -g "career guides present" --project=chromium`

Expected: FAIL，新标题和精选路线图不存在。

- [ ] **Step 3: 重组 ResourceExplorer**

保留搜索、类型和方向筛选。首条资源作为精选指南，但仍只渲染一次：

```tsx
const [featured, ...rest] = filtered;

return (
  <>
    {featured && <FeaturedGuide resource={featured} />}
    <div className="resource-card-grid">
      {rest.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  </>
);
```

为兼容数量测试，精选指南和普通卡片均使用 `data-testid="resource-row"`。

- [ ] **Step 4: 改造文章阅读页**

将返回文案改为“返回求职指南”，公开 Eyebrow 使用中文：

```tsx
<p className="page-kicker">{resource.type} · 平台整理 · 适用 2027 届</p>
```

目录桌面 sticky，移动端改为水平可滚动章节导航，不产生页面横向溢出。

- [ ] **Step 5: 验证完整内容与筛选**

Run: `npx playwright test tests/e2e/resources.spec.ts tests/e2e/public-site.spec.ts --project=chromium`

Expected: 6 份唯一完整资源、筛选可用、无外部假链接、正文至少 3 章节。

- [ ] **Step 6: 提交求职指南**

```bash
git add app/resources components/resource app/globals.css tests/e2e/resources.spec.ts tests/e2e/public-site.spec.ts
git commit -m "feat: redesign vehicle career guides"
```

## Task 8：重构关于页、错误状态和页脚文案

**Files:**

- Modify: `app/about/page.tsx`
- Modify: `app/error.tsx`
- Modify: `app/loading.tsx`
- Modify: `components/ui/data-state.tsx`
- Modify: `components/layout/site-footer.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/main.spec.ts`
- Test: `tests/e2e/public-site.spec.ts`

- [ ] **Step 1: 添加失败的关于页和反馈测试**

```ts
test("about page explains the public mission and offers a real feedback action", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", {
      name: "让车辆行业校招信息，更容易找到，也更容易相信",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "我们不会做什么" })).toBeVisible();
  await expect(page.getByRole("link", { name: "提交信息反馈" })).toHaveAttribute(
    "href",
    /github\.com\/xiaoqi8553\/vehicle-campus-hub\/issues\/new/,
  );
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/public-site.spec.ts -g "about page explains" --project=chromium`

Expected: FAIL，旧关于页标题仍为“关于 Vehicle Campus Hub”。

- [ ] **Step 3: 重写公众文案**

关于页包含三个清楚卡片：

```tsx
const principles = [
  ["我们整理什么", "企业招聘入口、具体校招项目、招聘时间、技术方向与求职准备资料。"],
  ["我们如何判断", "区分具体项目与通用招聘站，记录来源、届次、链接状态和最后核验时间。"],
  ["我们不会做什么", "不编造招聘日期、岗位和官方链接，也不把待确认信息包装成确定事实。"],
];
```

页脚不硬编码 `v2.1.0` 和旧结构日期，使用：

```tsx
<strong>车招雷达</strong>
<p>为车辆方向学生整理可信、清楚的校招信息。</p>
```

- [ ] **Step 4: 统一加载与错误状态**

错误信息使用学生可理解的文案：

```tsx
<DataState title="页面暂时没有加载成功" description="请稍后重试。已经收录的信息不会因此丢失。" />
```

- [ ] **Step 5: 验证关于页与生产后台守卫**

Run: `npx playwright test tests/e2e/main.spec.ts tests/e2e/public-site.spec.ts --project=chromium`

Expected: 关于页、反馈链接和 `/admin` 404 通过。

- [ ] **Step 6: 提交关于页**

```bash
git add app/about/page.tsx app/error.tsx app/loading.tsx components/ui/data-state.tsx components/layout/site-footer.tsx app/globals.css tests/e2e
git commit -m "feat: publish public mission and feedback experience"
```

## Task 9：四视口视觉与可访问性修复

**Files:**

- Modify: `tests/e2e/visual.spec.ts`
- Modify: `tests/e2e/trust.spec.ts`
- Modify: `app/globals.css`
- Create: `docs/redesign/2026-06-13/.gitkeep`

- [ ] **Step 1: 更新视觉测试截图目录和交互断言**

```ts
const viewports = [
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "ipad", width: 820, height: 1180 },
  { name: "desktop-1440", width: 1440, height: 1000 },
];

await page.screenshot({
  path: `docs/redesign/2026-06-13/${target.name}-${viewport.name}.png`,
  fullPage: true,
});
```

为搜索、选择器、导航、主按钮和反馈入口检查：

```ts
expect(await control.getAttribute("aria-label")).not.toBeNull();
expect(box.height).toBeGreaterThanOrEqual(44);
```

- [ ] **Step 2: 运行四视口测试并记录失败**

Run: `npx playwright test tests/e2e/visual.spec.ts tests/e2e/trust.spec.ts --project=chromium`

Expected: 首轮可能出现移动端热区、文字换行或旧选择器断言失败。

- [ ] **Step 3: 修复响应式与 reduced-motion**

在 CSS 中保证：

```css
@media (max-width: 680px) {
  .home-hero-grid,
  .company-detail-layout,
  .company-list-item {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 4: 运行完整 E2E**

Run: `npm run test:e2e`

Expected: 所有项目通过，只有原有明确标注的 viewport matrix skip。

- [ ] **Step 5: 提交视觉修复**

```bash
git add app/globals.css tests/e2e docs/redesign/2026-06-13
git commit -m "test: verify public site across viewports"
```

## Task 10：完整验证、报告与发布

**Files:**

- Modify: `CHANGELOG.md`
- Modify: `REDESIGN_REPORT.md`
- Modify: `TEST_REPORT.md`
- Modify: `README.md`

- [ ] **Step 1: 运行完整本地门禁**

Run:

```bash
npm run prisma:generate
npm run test:unit
npm run test:e2e
npm run lint
npm run typecheck
npm run format:check
npm run build
git diff --check
```

Expected: 全部退出码为 0。

- [ ] **Step 2: 使用真实浏览器检查六个页面**

访问：

```text
/
/companies
/companies/xiaomi-auto
/calendar
/resources
/about
```

检查：

- 页面层级、留白与公众文案符合设计规格。
- Desktop 1440、iPad、iPhone 14、iPhone SE 无横向溢出。
- 搜索、筛选、详情、外链、文章和反馈入口可用。
- 无 hydration、page error、严重 console error 和关键请求失败。

- [ ] **Step 3: 更新版本记录**

`CHANGELOG.md` 新增 `Unreleased`：

```md
## [Unreleased]

### Changed

- 将公众品牌更新为“车招雷达”，并重建全站视觉系统。
- 首页改为搜索、重点机会、最近变化和技术方向优先。
- 公司库与详情页使用学生可理解的机会状态和下一步操作。
- 日历删除重复观察记录，求职指南改为完整阅读入口。
```

`REDESIGN_REPORT.md` 记录参考站点、设计方向 A、六页前后截图和关键决策。  
`TEST_REPORT.md` 记录最终命令结果、四视口结果、仍需人工补充的企业证据数量。

- [ ] **Step 4: 提交最终报告**

```bash
git add README.md CHANGELOG.md REDESIGN_REPORT.md TEST_REPORT.md docs/redesign/2026-06-13
git commit -m "docs: record public website redesign"
```

- [ ] **Step 5: 推送、创建 PR 并等待门禁**

```bash
git push
gh pr create \
  --base main \
  --head codex/public-website-redesign \
  --title "feat: rebuild Vehicle Campus Hub as CheZhao Radar" \
  --body-file .github/PULL_REQUEST_TEMPLATE.md
gh pr checks --watch
```

Expected: `quality`、`pull-request-title`、`analyze`、`CodeQL` 和 `deploy-preview` 全部通过。

- [ ] **Step 6: 合并、生产部署和线上 smoke**

```bash
gh pr merge --squash --delete-branch
gh run list --branch main --limit 10
```

等待 `Production Smoke` 通过并创建 `deploy-日期-短SHA` 标签。然后运行：

```powershell
$env:SMOKE_BASE_URL='https://vehicle-campus-hub.vercel.app'
$env:EXPECTED_COMMIT=(git rev-parse origin/main).Trim()
npm run test:smoke
```

Expected: 六个核心路由 200、`/admin` 404、commit 匹配、无横向溢出、无无效链接和浏览器错误。
