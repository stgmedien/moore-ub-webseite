"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/moore-i18n";

export type BlogPostData = {
  slug: string;
  title: string;
  titleEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  contentHtml: string;
  contentHtmlEn: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: Date | null;
  readingMinutes: number;
  authorName: string | null;
};

export type RelatedPost = {
  slug: string;
  title: string;
  titleEn: string | null;
  publishedAt: Date | null;
};

function formatDate(d: Date | null, locale: string) {
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export default function BlogPostContent({
  post,
  related,
}: {
  post: BlogPostData;
  related: RelatedPost[];
}) {
  const { lang } = useLang();
  const no = lang === "no";
  const locale = no ? "nb-NO" : "en-GB";

  const title = (!no && post.titleEn) || post.title;
  const excerpt = (!no && post.excerptEn) || post.excerpt;
  const contentHtml = (!no && post.contentHtmlEn) || post.contentHtml;

  return (
    <article>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 56 }}>
          <Link
            href="/blog"
            className="eyebrow"
            style={{ color: "#ED4F3E", display: "inline-block" }}
          >
            {no ? "← AKTUELT" : "← NEWS"}
          </Link>
          <h1 style={{ fontSize: "clamp(32px,4.2vw,54px)", maxWidth: 820 }}>{title}</h1>
          <div
            style={{
              marginTop: 20,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "rgba(16,24,29,0.5)",
            }}
          >
            {formatDate(post.publishedAt, locale).toUpperCase()}
            {" — "}
            {post.readingMinutes} MIN
            {post.authorName ? ` — ${post.authorName.toUpperCase()}` : ""}
          </div>
          {excerpt && (
            <p className="lede" style={{ maxWidth: 620 }}>
              {excerpt}
            </p>
          )}
        </div>
      </section>

      {post.coverImageUrl && (
        <section>
          <div className="moore-container" style={{ paddingTop: 48 }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                border: "1px solid rgba(16,24,29,0.25)",
                overflow: "hidden",
              }}
            >
              <Image
                src={post.coverImageUrl}
                alt={post.coverImageAlt ?? title}
                fill
                preload
                style={{ objectFit: "cover" }}
                sizes="(min-width: 1240px) 1184px, 100vw"
              />
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="moore-container" style={{ paddingTop: 48, paddingBottom: 88 }}>
          <div className="moore-article" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(16,24,29,0.16)" }}>
          <div className="moore-container" style={{ paddingTop: 64, paddingBottom: 88 }}>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <span className="kicker">{no ? "FLERE ARTIKLER" : "MORE ARTICLES"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {related.map((r) => (
                <Link href={`/blog/${r.slug}`} className="news-row" key={r.slug}>
                  <span className="news-date">{formatDate(r.publishedAt, locale)}</span>
                  <span className="news-title">{(!no && r.titleEn) || r.title}</span>
                  <span className="news-more">{no ? "LES MER →" : "READ MORE →"}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="moore-container cta-band-inner">
          <h2>{no ? "Klar for sporbare trosser?" : "Ready for traceable mooring lines?"}</h2>
          <Link href="/kontakt" className="btn btn-red btn-cta">
            {no ? "Kontakt oss" : "Contact us"}
          </Link>
        </div>
      </section>
    </article>
  );
}
