import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import BlogIndexContent from "@/components/moore/BlogIndexContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aktuelt",
  description:
    "Nyheter og artikler fra Moore UB — om MOORE ID, sporbare trosser og en mer bærekraftig sjøfart.",
};

export default async function BlogIndex() {
  const posts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      titleEn: blogPosts.titleEn,
      excerpt: blogPosts.excerpt,
      excerptEn: blogPosts.excerptEn,
      publishedAt: blogPosts.publishedAt,
      readingMinutes: blogPosts.readingMinutes,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  return <BlogIndexContent posts={posts} />;
}
