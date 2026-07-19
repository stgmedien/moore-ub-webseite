import type { Metadata } from "next";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import OmOssContent, { type NewsItem } from "@/components/moore/OmOssContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Moore UB er en ungdomsbedrift ved Thora Storm videregående skole i Trondheim. Vi gir tau en digital identitet — og reduserer overforbruket som skyldes manglende sporbarhet.",
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export default async function OmOssPage() {
  let news: NewsItem[] = [];
  try {
    const posts = await db
      .select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(3);
    news = posts.map((p) => ({
      date: formatDate(p.publishedAt),
      title: p.title,
      href: `/blog/${p.slug}`,
    }));
  } catch {
    // DB not reachable — render the page without the news section
  }

  return <OmOssContent news={news} />;
}
