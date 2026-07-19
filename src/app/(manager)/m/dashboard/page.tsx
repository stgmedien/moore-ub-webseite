import { db } from "@/lib/db";
import { blogPosts, contactSubmissions, users } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import { FileText, Inbox, Users2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard · Moore UB Manager" };

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function Dashboard() {
  const [postCounts, submissionCount, userCount, latestSubmissions, latestPosts] =
    await Promise.all([
      db
        .select({ status: blogPosts.status, count: sql<number>`count(*)::int` })
        .from(blogPosts)
        .groupBy(blogPosts.status),
      db.select({ count: sql<number>`count(*)::int` }).from(contactSubmissions),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(5),
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          status: blogPosts.status,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .orderBy(desc(blogPosts.updatedAt))
        .limit(5),
    ]);

  const published = postCounts.find((p) => p.status === "published")?.count ?? 0;
  const drafts = postCounts.find((p) => p.status === "draft")?.count ?? 0;

  const stats = [
    {
      label: "Blogartikel (live)",
      value: published,
      sub: `${drafts} Entwürfe`,
      href: "/m/blog",
      Icon: FileText,
    },
    {
      label: "Kontakt-Anfragen",
      value: submissionCount[0]?.count ?? 0,
      sub: "über das Formular",
      href: "/m/anfragen",
      Icon: Inbox,
    },
    {
      label: "Benutzer",
      value: userCount[0]?.count ?? 0,
      sub: "mit Backend-Zugang",
      href: "/m/benutzer",
      Icon: Users2,
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <h1 className="font-display text-3xl font-bold text-wh-black mb-1">Dashboard</h1>
      <p className="text-wh-fg-muted mb-8">Willkommen im Moore-UB-Backend.</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-black/10 bg-white p-5 no-underline hover:border-black/25 transition-colors"
          >
            <div className="flex items-center gap-2 text-wh-fg-muted text-sm">
              <s.Icon size={16} /> {s.label}
            </div>
            <div className="font-display text-3xl font-bold text-wh-black mt-2">{s.value}</div>
            <div className="text-xs text-wh-fg-soft mt-1">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-wh-black">Neueste Anfragen</h2>
            <Link
              href="/m/anfragen"
              className="text-sm text-wh-fg-muted hover:text-wh-black no-underline flex items-center gap-1"
            >
              Alle <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-xl border border-black/10 bg-white divide-y divide-black/5">
            {latestSubmissions.length === 0 && (
              <p className="p-4 text-sm text-wh-fg-muted">Noch keine Anfragen.</p>
            )}
            {latestSubmissions.map((s) => (
              <div key={s.id} className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-sm text-wh-black">{s.name}</span>
                  <span className="text-xs text-wh-fg-soft shrink-0">
                    {formatDateTime(s.createdAt)}
                  </span>
                </div>
                <div className="text-xs text-wh-fg-muted mt-0.5">
                  {s.email}
                  {s.topic ? ` · ${s.topic}` : ""}
                </div>
                <p className="text-sm text-wh-fg-muted mt-1 line-clamp-2">{s.message}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-wh-black">Blog</h2>
            <Link
              href="/m/blog"
              className="text-sm text-wh-fg-muted hover:text-wh-black no-underline flex items-center gap-1"
            >
              Verwalten <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-xl border border-black/10 bg-white divide-y divide-black/5">
            {latestPosts.length === 0 && (
              <p className="p-4 text-sm text-wh-fg-muted">Noch keine Artikel.</p>
            )}
            {latestPosts.map((p) => (
              <Link
                key={p.id}
                href={`/m/blog/${p.id}`}
                className="p-4 flex items-center justify-between gap-3 no-underline hover:bg-black/[0.02]"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-wh-black truncate">{p.title}</div>
                  <div className="text-xs text-wh-fg-soft mt-0.5">
                    {formatDateTime(p.updatedAt)}
                  </div>
                </div>
                <span
                  className={
                    "text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full shrink-0 " +
                    (p.status === "published"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800")
                  }
                >
                  {p.status === "published" ? "Live" : "Entwurf"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
