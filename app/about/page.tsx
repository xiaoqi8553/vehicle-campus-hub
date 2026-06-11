import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

const audience = [
  "车辆工程",
  "机械工程",
  "自动化",
  "控制",
  "嵌入式",
  "自动驾驶",
  "三电",
  "电池",
  "热管理",
  "智能座舱",
];

const credibilityRules = [
  { title: "官方", copy: "企业招聘站、官网、官方公众号或可核验官方入口。" },
  { title: "较可信", copy: "学校就业网、企业公开页面或多渠道一致的公开整理。" },
  { title: "经验参考", copy: "候选人复盘和面经，只用于准备方向，不代表企业题库。" },
  { title: "待核实", copy: "缺少来源链接、投递入口或核验时间，页面会明确显示待补充。" },
];

export default function AboutPage() {
  return (
    <div className="shell page-space about-page">
      <div className="page-heading">
        <p className="eyebrow">ABOUT VEHICLE CAMPUS HUB</p>
        <h1>关于 Vehicle Campus Hub</h1>
        <p>Vehicle Campus Hub 是面向 2027 届车辆行业求职学生的信息聚合平台，优先整理官方投递入口、校招时间线、岗位方向、来源可信度和笔试面经准备资料。</p>
      </div>

      <section className="about-card-grid">
        <article className="about-card">
          <CheckCircle2 size={22} />
          <h2>项目定位</h2>
          <p>聚合车企、新势力、自动驾驶、三电、电池、热管理、零部件和智能化供应商的校园招聘信息，帮助学生判断“能不能投、什么时候投、适合投什么方向”。</p>
        </article>
        <article className="about-card">
          <CheckCircle2 size={22} />
          <h2>面向人群</h2>
          <p>适合车辆工程、机械工程、自动化、控制、嵌入式、自动驾驶、三电、电池、热管理和智能座舱方向的本科、硕士和博士应届生。</p>
          <div className="tag-row">{audience.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
        </article>
      </section>

      <section className="detail-section">
        <div className="detail-section-title"><ShieldAlert size={20} /><h2>信息来源与可信度规则</h2></div>
        <div className="credibility-grid">
          {credibilityRules.map((rule) => (
            <article key={rule.title}>
              <strong>{rule.title}</strong>
              <p>{rule.copy}</p>
            </article>
          ))}
        </div>
        <p className="about-disclaimer">平台不会把无来源信息标记为官方。若企业投递链接、截止时间或岗位城市发生变化，请以企业官方招聘站、官方公众号或学校就业网最终通知为准。</p>
      </section>

      <section className="detail-section" id="feedback">
        <div className="detail-section-title"><CheckCircle2 size={20} /><h2>纠错反馈方式</h2></div>
        <p>如果你发现某家公司 2027 届校招入口、截止时间、岗位方向或资料来源有误，可以在后续版本通过站内反馈表提交。当前阶段请在 GitHub Issue 或项目维护入口补充：公司名、正确链接、来源截图或公告链接、核验日期。</p>
        <Link href="/companies" className="button button-primary">返回公司库<ArrowRight size={15} /></Link>
      </section>

      <section className="detail-section">
        <div className="detail-section-title"><CheckCircle2 size={20} /><h2>后续计划</h2></div>
        <div className="roadmap-list">
          <p><strong>微信小程序：</strong>复用 Company、RecruitmentProgram、Job、Resource、CalendarEvent 数据结构，增加订阅提醒。</p>
          <p><strong>App：</strong>增加收藏、岗位匹配、截止提醒、投递进度和资料纠错队列。</p>
          <p><strong>数据运营：</strong>补充更多官方入口、定时链接核验、过期提醒和学校就业网来源归档。</p>
        </div>
      </section>
    </div>
  );
}
