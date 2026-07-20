import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { mailTemplates } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { createTemplate } from "./actions";
import { DeleteTemplateButton } from "./DeleteTemplateButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mail templates · Moore UB Manager" };

export default async function MailTemplatesPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "manager" && role !== "admin") redirect("/m/dashboard");

  const all = await db.select().from(mailTemplates).orderBy(asc(mailTemplates.key));

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1100px]">
      <div className="eyebrow">Manager · Communication</div>
      <h1 className="text-[36px] mt-2 mb-1">Mail templates.</h1>
      <p className="text-[var(--color-wh-fg-muted)] m-0 mb-8">
        Versioned templates with a Markdown body and{" "}
        <code className="text-xs">{`{{variable}}`}</code> substitution. Every change creates a
        new version; old versions are kept for audit + rollback.
      </p>

      {/* Liste */}
      <section className="bg-white border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-wh-winter-grey)]">
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                Key
              </th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                Status
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {all.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-[var(--color-wh-fg-muted)]">
                  No templates yet. Create the first one below.
                </td>
              </tr>
            ) : (
              all.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[var(--color-wh-winter-grey)]/30"
                >
                  <td className="px-4 py-3 font-mono text-xs">{t.key}</td>
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">
                    {t.activeVersionId ? (
                      <span className="text-emerald-700 text-xs">✓ active</span>
                    ) : (
                      <span className="text-amber-700 text-xs">no active version yet</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-3 justify-end items-center">
                      <Link
                        href={`/m/mail-templates/${t.id}`}
                        className="text-[var(--color-wh-deep-green)] underline text-sm"
                      >
                        Edit
                      </Link>
                      <DeleteTemplateButton id={t.id} name={t.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Neu anlegen */}
      <section className="bg-[var(--color-wh-beige)] border border-[var(--color-wh-winter-grey)] rounded-[var(--radius-card)] p-6">
        <h2 className="text-[20px] m-0 mb-4">Create new template</h2>
        <form
          action={async (fd) => {
            "use server";
            await createTemplate(fd);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <label className="block text-xs uppercase text-[var(--color-wh-fg-muted)] mb-1">
              Key (a-z, _, -)
            </label>
            <input
              type="text"
              name="key"
              required
              pattern="[a-z0-9_-]+"
              placeholder="e.g. booking-reminder-custom"
              className="w-full rounded-lg border border-[var(--color-wh-winter-grey)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[var(--color-wh-fg-muted)] mb-1">
              Display name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Personal booking reminder"
              className="w-full rounded-lg border border-[var(--color-wh-winter-grey)] px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-[var(--color-wh-fg-muted)] mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              name="description"
              placeholder="When is this mail sent?"
              className="w-full rounded-lg border border-[var(--color-wh-winter-grey)] px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-[var(--color-wh-fg-muted)] mb-1">
              Available variables (comma-separated)
            </label>
            <input
              type="text"
              name="variables"
              placeholder="firstName, bookingNumber, arrival, …"
              className="w-full rounded-lg border border-[var(--color-wh-winter-grey)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--color-wh-deep-green)] text-white px-5 py-2.5 text-sm font-semibold"
            >
              Create template
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
