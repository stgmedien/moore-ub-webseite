import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inquiries · Moore UB Manager" };

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AnfragenPage() {
  const submissions = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(200);

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="font-display text-3xl font-bold text-wh-black mb-1">Inquiries</h1>
      <p className="text-wh-fg-muted mb-8">
        Messages from the website contact form — replies go directly to the sender by e-mail
        (Reply-To is set).
      </p>

      <div className="flex flex-col gap-4">
        {submissions.length === 0 && (
          <p className="text-sm text-wh-fg-muted">No inquiries received yet.</p>
        )}
        {submissions.map((s) => (
          <article key={s.id} className="rounded-xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold text-wh-black">
                {s.name}
                <a
                  href={`mailto:${s.email}`}
                  className="ml-2 text-sm font-normal text-wh-fg-muted hover:text-wh-black"
                >
                  {s.email}
                </a>
              </div>
              <time className="text-xs text-wh-fg-soft">{formatDateTime(s.createdAt)}</time>
            </div>
            <div className="mt-1 flex gap-2 text-[11px] uppercase tracking-wide text-wh-fg-soft">
              {s.topic && (
                <span className="bg-black/5 rounded-full px-2 py-0.5 font-semibold">{s.topic}</span>
              )}
              <span className="bg-black/5 rounded-full px-2 py-0.5">{s.lang?.toUpperCase()}</span>
            </div>
            <p className="mt-3 text-sm text-wh-fg-muted whitespace-pre-wrap">{s.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
