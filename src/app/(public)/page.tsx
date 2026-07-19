import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import HomeContent, { type LatestPost } from "@/components/moore/HomeContent";

// ISR: Startseite bleibt statisch-schnell, der News-Ticker aktualisiert sich
// spätestens 2 Minuten nach dem Veröffentlichen eines Artikels.
export const revalidate = 120;

export default async function Home() {
  let latestPost: LatestPost | null = null;
  try {
    const rows = await db
      .select({ title: blogPosts.title, slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(1);
    latestPost = rows[0] ?? null;
  } catch {
    // DB nicht erreichbar — Startseite ohne Ticker rendern
  }
  return <HomeContent latestPost={latestPost} />;
}
