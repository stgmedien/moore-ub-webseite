"use client";

import Link from "next/link";
import { useLang } from "@/lib/moore-i18n";

export type BlogIndexPost = {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  publishedAt: Date | null;
  readingMinutes: number;
};

function formatDate(d: Date | null, locale: string) {
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export default function BlogIndexContent({ posts }: { posts: BlogIndexPost[] }) {
  const { lang } = useLang();
  const no = lang === "no";
  const locale = no ? "nb-NO" : "en-GB";

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            {no ? "AKTUELT" : "NEWS"}
          </div>
          <h1>{no ? "Aktuelt." : "News."}</h1>
          <p className="lede" style={{ maxWidth: 560 }}>
            {no
              ? "Nyheter og artikler fra Moore UB — om MOORE ID, sporbare trosser og en mer bærekraftig sjøfart."
              : "News and articles from Moore UB — about MOORE ID, traceable mooring lines and a more sustainable maritime industry."}
          </p>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 48, paddingBottom: 96 }}>
          {posts.length === 0 ? (
            <p style={{ fontSize: 15, color: "rgba(16,24,29,0.6)" }}>
              {no ? "Ingen artikler publisert ennå." : "No articles published yet."}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {posts.map((p) => {
                const title = (!no && p.titleEn) || p.title;
                const excerpt = (!no && p.excerptEn) || p.excerpt;
                return (
                  <Link href={`/blog/${p.slug}`} className="news-row" key={p.id}>
                    <span className="news-date">{formatDate(p.publishedAt, locale)}</span>
                    <span>
                      <span className="news-title">{title}</span>
                      {excerpt && (
                        <span
                          style={{
                            display: "block",
                            fontSize: 13.5,
                            lineHeight: 1.6,
                            color: "rgba(16,24,29,0.6)",
                            marginTop: 6,
                            maxWidth: 620,
                          }}
                        >
                          {excerpt}
                        </span>
                      )}
                    </span>
                    <span className="news-more">{no ? "LES MER →" : "READ MORE →"}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
