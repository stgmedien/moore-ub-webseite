import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { blogPosts, users } from "@/lib/db/schema";
import { eq, and, desc, ne } from "drizzle-orm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);
  const p = found[0];
  if (!p) return { title: "Artikkel ikke funnet" };
  return {
    title: p.metaTitle ?? p.title,
    description: p.metaDescription ?? p.excerpt ?? undefined,
    openGraph: {
      title: p.metaTitle ?? p.title,
      description: p.metaDescription ?? p.excerpt ?? undefined,
      type: "article",
      images: p.coverImageUrl ? [p.coverImageUrl] : undefined,
      publishedTime: p.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const found = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      contentHtml: blogPosts.contentHtml,
      coverImageUrl: blogPosts.coverImageUrl,
      coverImageAlt: blogPosts.coverImageAlt,
      publishedAt: blogPosts.publishedAt,
      readingMinutes: blogPosts.readingMinutes,
      authorName: users.name,
    })
    .from(blogPosts)
    .leftJoin(users, eq(users.id, blogPosts.authorId))
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);
  const post = found[0];
  if (!post) notFound();

  const related = await db
    .select({
      slug: blogPosts.slug,
      title: blogPosts.title,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), ne(blogPosts.slug, slug)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <article>
      <section className="grid-bg page-hero">
        <div className="moore-container" style={{ paddingTop: 72, paddingBottom: 56 }}>
          <Link
            href="/blog"
            className="eyebrow"
            style={{ color: "#ED4F3E", display: "inline-block" }}
          >
            ← AKTUELT
          </Link>
          <h1 style={{ fontSize: "clamp(32px,4.2vw,54px)", maxWidth: 820 }}>{post.title}</h1>
          <div
            style={{
              marginTop: 20,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "rgba(16,24,29,0.5)",
            }}
          >
            {formatDate(post.publishedAt).toUpperCase()}
            {" — "}
            {post.readingMinutes} MIN
            {post.authorName ? ` — ${post.authorName.toUpperCase()}` : ""}
          </div>
          {post.excerpt && (
            <p className="lede" style={{ maxWidth: 620 }}>
              {post.excerpt}
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
                alt={post.coverImageAlt ?? post.title}
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
          <div
            className="moore-article"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(16,24,29,0.16)" }}>
          <div className="moore-container" style={{ paddingTop: 64, paddingBottom: 88 }}>
            <div className="section-head" style={{ marginBottom: 12 }}>
              <span className="kicker">FLERE ARTIKLER</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {related.map((r) => (
                <Link href={`/blog/${r.slug}`} className="news-row" key={r.slug}>
                  <span className="news-date">{formatDate(r.publishedAt)}</span>
                  <span className="news-title">{r.title}</span>
                  <span className="news-more">LES MER →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="moore-container cta-band-inner">
          <h2>Klar for sporbare trosser?</h2>
          <Link href="/kontakt" className="btn btn-red btn-cta">
            Kontakt oss
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.coverImageUrl ?? undefined,
            datePublished: post.publishedAt?.toISOString(),
            author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
            publisher: {
              "@type": "Organization",
              name: "Moore UB",
              logo: { "@type": "ImageObject", url: `${baseUrl}/logo.svg` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
          }),
        }}
      />
    </article>
  );
}
