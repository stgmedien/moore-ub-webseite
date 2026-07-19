import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { Session } from "next-auth";

/**
 * Auth-Guard für Manager-Server-Actions.
 *
 * Prüft neben Session und Rolle auch, dass der Session-User noch in der
 * Datenbank existiert: JWT-Sessions überleben das Löschen eines Benutzers,
 * und Inserts mit der verwaisten User-ID scheitern sonst an der
 * Fremdschlüssel-Prüfung (z. B. blog_posts.author_id).
 */
export async function requireManager(): Promise<Session> {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  const role = (session.user as { role?: string } | undefined)?.role;
  if (role !== "manager" && role !== "admin") throw new Error("Forbidden");

  const id = (session.user as { id?: string } | undefined)?.id;
  const found = id
    ? await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1)
    : [];
  if (!found[0]) {
    // Benutzer wurde gelöscht — Session ist wertlos, zurück zum Login.
    redirect("/m/login?error=session_stale");
  }

  return session;
}
