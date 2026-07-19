import Link from "next/link";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aktuelt",
  description:
    "Nyheter og artikler fra Moore UB — om MOORE ID, sporbare trosser og en mer bærekraftig sjøfart.",
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export default async function BlogIndex() {
  const posts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      publishedAt: blogPosts.publishedAt,
      readingMinutes: blogPosts.readingMinutes,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  return (
    <>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
          <div className="eyebrow" style={{ color: "#ED4F3E" }}>
            AKTUELT
          </div>
          <h1>Aktuelt.</h1>
          <p className="lede" style={{ maxWidth: 560 }}>
            Nyheter og artikler fra Moore UB — om MOORE ID, sporbare trosser og en mer bærekraftig
            sjøfart.
          </p>
        </div>
      </section>

      <section>
        <div className="moore-container" style={{ paddingTop: 48, paddingBottom: 96 }}>
          {posts.length === 0 ? (
            <p style={{ fontSize: 15, color: "rgba(16,24,29,0.6)" }}>
              Ingen artikler publisert ennå.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {posts.map((p) => (
                <Link href={`/blog/${p.slug}`} className="news-row" key={p.id}>
                  <span className="news-date">{formatDate(p.publishedAt)}</span>
                  <span>
                    <span className="news-title">{p.title}</span>
                    {p.excerpt && (
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
                        {p.excerpt}
                      </span>
                    )}
                  </span>
                  <span className="news-more">LES MER →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
