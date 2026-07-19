/**
 * Ersten Admin für eine frische Installation anlegen.
 *
 * Aufruf:
 *   ADMIN_EMAIL="du@example.com" ADMIN_NAME="Vorname Nachname" ADMIN_PASSWORD="mind10zeichen1" \
 *     npx tsx --env-file=.env.local scripts/create-admin.ts
 *
 * Der Admin muss das Passwort beim ersten Login ändern (mustChangePassword)
 * und wird beim ersten Manager-Login zur 2FA-Einrichtung geführt.
 */
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
  const name = process.env.ADMIN_NAME ?? "Admin";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!email || password.length < 10) {
    console.error("Bitte ADMIN_EMAIL und ADMIN_PASSWORD (mind. 10 Zeichen) setzen.");
    process.exit(1);
  }
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    console.error(`User ${email} existiert bereits.`);
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({
    email,
    name,
    passwordHash,
    role: "admin",
    mustChangePassword: true,
    emailVerified: new Date(),
  });
  console.log(`✓ Admin ${email} angelegt — Login unter /m/login (Passwort beim ersten Login ändern).`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
