import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getResource } from "@/lib/data";

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource || !resource.content.length) notFound();

  return (
    <div className="shell page-space resource-article-page">
      <Link className="back-link" href="/resources">
        <ArrowLeft size={16} />
        返回资料库
      </Link>
      <header className="resource-article-header">
        <p className="eyebrow">{resource.type} / 平台整理 / 适用 2027 届</p>
        <h1>{resource.title}</h1>
        <p>{resource.summary}</p>
        <div className="tag-row">
          {resource.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="resource-article-layout">
        <nav aria-label="文章目录" className="article-toc">
          <strong>文章目录</strong>
          {resource.content.map((section, index) => (
            <a href={`#section-${index + 1}`} key={section.heading}>
              {String(index + 1).padStart(2, "0")} {section.heading}
            </a>
          ))}
        </nav>
        <article className="resource-article">
          {resource.content.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.heading}>
              <p className="eyebrow">SECTION {String(index + 1).padStart(2, "0")}</p>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul>
                {section.checklist.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={17} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
