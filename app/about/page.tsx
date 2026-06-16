import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  DatabaseZap,
  HeartHandshake,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

const FEEDBACK_URL =
  "https://github.com/xiaoqi8553/vehicle-campus-hub/issues/new?template=data-correction.md";

const principles = [
  {
    icon: Compass,
    title: "我们整理什么",
    copy: "企业招聘入口、具体校招项目、招聘时间、技术方向与求职准备资料。",
  },
  {
    icon: ShieldCheck,
    title: "我们如何判断",
    copy: "区分具体项目与通用招聘站，记录来源、届次、链接状态和最后核验时间。",
  },
  {
    icon: DatabaseZap,
    title: "我们不会做什么",
    copy: "不编造招聘日期、岗位和官方链接，也不把待确认信息包装成确定事实。",
  },
];

const audience = [
  "车辆工程",
  "机械工程",
  "自动化与控制",
  "自动驾驶",
  "嵌入式与车载软件",
  "三电与电池",
  "热管理",
  "智能座舱",
];

export default function AboutPage() {
  return (
    <div className="shell page-space about-public-page">
      <PageHero
        eyebrow="关于车招雷达"
        title="让车辆行业校招信息，更容易找到，也更容易相信"
        description="车招雷达面向 2027 届车辆方向学生，整理分散在企业招聘站、官方公告和公开页面中的信息，帮助你更快判断现在能做什么。"
        aside={
          <div className="about-hero-mark" aria-hidden="true">
            <Sparkles size={24} />
          </div>
        }
      />

      <section className="about-principle-grid">
        {principles.map(({ icon: Icon, title, copy }) => (
          <article key={title}>
            <span>
              <Icon size={22} />
            </span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="about-story-grid">
        <div className="about-story-copy">
          <p className="page-kicker">为谁服务</p>
          <h2>面向车辆行业方向同学的信息服务</h2>
          <p>
            我们关注整车、新势力、自动驾驶、三电、电池、热管理、零部件与智能化供应商，优先帮助专业方向明确、但信息渠道分散的学生建立自己的企业清单。
          </p>
          <div className="about-audience-list">
            {audience.map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} />
                {item}
              </span>
            ))}
          </div>
        </div>
        <aside className="about-belief-card">
          <HeartHandshake size={27} />
          <blockquote>
            “可靠”不等于把页面做成审计报告。用户应该先看懂机会，再自然地看到来源和核验时间。
          </blockquote>
          <p>这是车招雷达所有页面共同遵循的产品原则。</p>
        </aside>
      </section>

      <section className="about-rules-section">
        <div className="section-title">
          <div>
            <p className="page-kicker">信息规则</p>
            <h2>一条信息如何进入车招雷达</h2>
            <p>我们按用途和证据强度表达信息，不让一个通用招聘首页变成“2027 届已开放”的证明。</p>
          </div>
        </div>
        <div className="about-rule-list">
          <article>
            <strong>01</strong>
            <div>
              <h3>先判断链接是什么</h3>
              <p>具体项目、校园招聘门户、通用招聘官网、官方公告和企业介绍页分开记录。</p>
            </div>
          </article>
          <article>
            <strong>02</strong>
            <div>
              <h3>再核对届次与状态</h3>
              <p>只有页面明确提到 2027 届并且仍可访问，才会计入明确开放项目。</p>
            </div>
          </article>
          <article>
            <strong>03</strong>
            <div>
              <h3>最后说明核验时间</h3>
              <p>招聘信息变化很快，用户需要知道最近何时检查过，而不是只看到一个按钮。</p>
            </div>
          </article>
        </div>
      </section>

      <section className="about-feedback-section" id="feedback">
        <div>
          <p className="page-kicker">一起完善</p>
          <h2>你发现的信息，可以帮助下一位同学</h2>
          <p>
            提交公司名、原链接、建议链接、变化说明和核验日期。公开反馈会留下处理记录，也方便后续复查。
          </p>
          <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" aria-label="提交信息反馈">
            <MessageSquareText size={17} />
            提交信息反馈
            <ArrowUpRight size={16} />
          </a>
        </div>
        <aside className="about-feedback-tips">
          <strong>提交时请尽量包含</strong>
          <ul>
            <li>公司或项目名称</li>
            <li>当前页面与正确链接</li>
            <li>变化说明和核验日期</li>
          </ul>
        </aside>
      </section>

      <section className="about-roadmap">
        <p className="page-kicker">下一步</p>
        <h2>从网站走向更连续的求职工具</h2>
        <div>
          <article>
            <strong>微信小程序</strong>
            <p>复用企业、项目、日历和指南数据，增加订阅提醒。</p>
          </article>
          <article>
            <strong>移动 App</strong>
            <p>增加收藏、截止提醒和个人投递进度。</p>
          </article>
          <article>
            <strong>长期数据维护</strong>
            <p>持续核验官方入口、归档变化并明确标记过期信息。</p>
          </article>
        </div>
        <small>
          免责声明：招聘信息以企业官方页面和最终通知为准，平台内容仅用于信息整理与求职准备。
        </small>
      </section>
    </div>
  );
}
