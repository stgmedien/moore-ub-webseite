"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, activityLog } from "@/lib/db/schema";
import { requireManager } from "@/lib/require-manager";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/mail/send";
import UserWelcomeEmail from "@/lib/mail/templates/user-welcome";

type Role = "customer" | "member" | "manager" | "admin";

const requireAdmin = async () => {
  const session = await requireManager();
  const role = (session.user as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Forbidden — admin rights required");
  return session;
};

type SessionLike = { user?: { id?: string; email?: string | null; name?: string | null } | null } | null;
const currentUserId = (session: SessionLike): string => session?.user?.id ?? "";

/**
 * Generate a memorable random password (12 chars, alphanumeric, no
 * confusable characters).
 */
export const generatePassword = async (): Promise<string> => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnopqrstuvwxyz";
  let out = "";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 12; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
};

const createSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(255),
  role: z.enum(["manager", "admin"]),
  password: z
    .string()
    .min(10, "At least 10 characters.")
    .max(128)
    .regex(/[A-Za-z]/, "At least one letter.")
    .regex(/[0-9]/, "At least one digit."),
  sendWelcomeMail: z.boolean().default(true),
});

export type CreateResult =
  | { ok: true; userId: string; tempPassword: string }
  | { ok: false; error: string };

export async function createUser(raw: z.infer<typeof createSchema>): Promise<CreateResult> {
  const session = await requireAdmin();
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase().trim();

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    return { ok: false, error: `A user with the e-mail ${email} already exists.` };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const inserted = await db
    .insert(users)
    .values({
      email,
      name: data.name.trim(),
      passwordHash,
      role: data.role as Role,
      mustChangePassword: true,  // neue User müssen beim ersten Login eigenes Passwort setzen
    })
    .returning({ id: users.id });

  const adminName = session.user?.name ?? session.user?.email ?? "Admin";

  await db.insert(activityLog).values({
    who: adminName,
    what: `User created: ${email} (role ${data.role})`,
  });

  if (data.sendWelcomeMail) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.mooreub.no";
    try {
      await sendMail({
        to: email,
        subject: "Your access to the Moore UB manager backend",
        template: "user-welcome",
        react: UserWelcomeEmail({
          name: data.name,
          email,
          role: data.role,
          initialPassword: data.password,
          loginUrl: `${baseUrl}/m/login`,
          invitedBy: adminName,
        }),
      });
    } catch (err) {
      console.error("[users.create] welcome mail failed", err);
      await db.insert(activityLog).values({
        who: "System",
        what: `Welcome mail to ${email} failed — please share the credentials another way`,
      });
    }
  }

  revalidatePath("/m/benutzer");
  return { ok: true, userId: inserted[0].id, tempPassword: data.password };
}

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["customer", "member", "manager", "admin"]),
});

export async function updateUserRole(
  raw: z.infer<typeof updateRoleSchema>
): Promise<{ ok: boolean; error?: string }> {
  const session = await requireAdmin();
  const parsed = updateRoleSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  const { userId, role } = parsed.data;
  const meId = currentUserId(session);

  if (userId === meId) {
    return { ok: false, error: "You cannot change your own role." };
  }

  // Last-admin guard: when DEMOTING someone (target is currently admin AND new role isn't admin),
  // refuse if they're the only admin left.
  const targetUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!targetUser[0]) return { ok: false, error: "User not found." };
  if (targetUser[0].role === "admin" && role !== "admin") {
    const otherAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.role, "admin"), ne(users.id, userId)));
    if (otherAdmins.length === 0) {
      return {
        ok: false,
        error: "The last admin cannot be demoted — create another admin first.",
      };
    }
  }

  await db
    .update(users)
    .set({ role: role as Role, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await db.insert(activityLog).values({
    who: session.user?.name ?? session.user?.email ?? "Admin",
    what: `Role changed: ${targetUser[0].email} → ${role} (before: ${targetUser[0].role})`,
  });

  revalidatePath("/m/benutzer");
  return { ok: true };
}

const resetPwSchema = z.object({
  userId: z.string().uuid(),
  newPassword: z
    .string()
    .min(10, "At least 10 characters.")
    .max(128)
    .regex(/[A-Za-z]/, "At least one letter.")
    .regex(/[0-9]/, "At least one digit."),
  sendMail: z.boolean().default(false),
});

export type ResetPwResult =
  | { ok: true; tempPassword: string }
  | { ok: false; error: string };

export async function resetUserPassword(
  raw: z.infer<typeof resetPwSchema>
): Promise<ResetPwResult> {
  const session = await requireAdmin();
  const parsed = resetPwSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  const { userId, newPassword, sendMail: shouldSendMail } = parsed.data;

  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) return { ok: false, error: "User not found." };

  const hash = await bcrypt.hash(newPassword, 12);
  await db
    .update(users)
    .set({
      passwordHash: hash,
      mustChangePassword: true,  // erzwingt Wechsel beim nächsten Login
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await db.insert(activityLog).values({
    who: session.user?.name ?? session.user?.email ?? "Admin",
    what: `Password reset for ${target[0].email}`,
  });

  if (shouldSendMail && target[0].email) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.mooreub.no";
    try {
      await sendMail({
        to: target[0].email,
        subject: "Your new password for the Moore UB backend",
        template: "user-welcome",
        react: UserWelcomeEmail({
          name: target[0].name ?? target[0].email,
          email: target[0].email,
          role: (target[0].role as "manager" | "admin") ?? "manager",
          initialPassword: newPassword,
          loginUrl: `${baseUrl}/m/login`,
          invitedBy: session.user?.name ?? session.user?.email ?? "Admin",
        }),
      });
    } catch (err) {
      console.error("[users.resetPw] mail failed", err);
    }
  }

  revalidatePath("/m/benutzer");
  return { ok: true, tempPassword: newPassword };
}

const updateEmailSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email().max(255),
});

export async function updateUserEmail(
  raw: z.infer<typeof updateEmailSchema>
): Promise<{ ok: boolean; error?: string }> {
  const session = await requireAdmin();
  const parsed = updateEmailSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid e-mail address." };
  const { userId, email: newEmail } = parsed.data;
  const lower = newEmail.toLowerCase().trim();

  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) return { ok: false, error: "User not found." };

  const conflict = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, lower), ne(users.id, userId)))
    .limit(1);
  if (conflict[0]) return { ok: false, error: `The address ${lower} is already taken.` };

  await db
    .update(users)
    .set({ email: lower, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await db.insert(activityLog).values({
    who: session.user?.name ?? session.user?.email ?? "Admin",
    what: `E-mail changed: ${target[0].email} → ${lower}`,
  });

  revalidatePath("/m/benutzer");
  return { ok: true };
}

export async function deleteUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  const session = await requireAdmin();
  const meId = currentUserId(session);
  if (userId === meId) return { ok: false, error: "You cannot delete yourself." };

  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) return { ok: false, error: "User not found." };

  if (target[0].role === "admin") {
    const otherAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.role, "admin"), ne(users.id, userId)));
    if (otherAdmins.length === 0) {
      return {
        ok: false,
        error: "The last admin cannot be deleted — create another admin first.",
      };
    }
  }

  await db.delete(users).where(eq(users.id, userId));
  await db.insert(activityLog).values({
    who: session.user?.name ?? session.user?.email ?? "Admin",
    what: `User deleted: ${target[0].email}`,
  });

  revalidatePath("/m/benutzer");
  return { ok: true };
}
