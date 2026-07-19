import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { blogPosts, users } from "@/lib/db/schema";
import { eq, and, desc, ne } from "drizzle-orm";
import type { Metadata } from "next";
import BlogPostContent from "@/components/moore/BlogPostContent";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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
      titleEn: blogPosts.titleEn,
      excerpt: blogPosts.excerpt,
      excerptEn: blogPosts.excerptEn,
      contentHtml: blogPosts.contentHtml,
      contentHtmlEn: blogPosts.contentHtmlEn,
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
      titleEn: blogPosts.titleEn,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), ne(blogPosts.slug, slug)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <>
      <BlogPostContent post={post} related={related} />
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
    </>
  );
}
