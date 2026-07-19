import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";

export const runtime = "nodejs";

const LIMITS = { name: 120, email: 200, topic: 120, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Submission = {
  name: string;
  email: string;
  topic: string;
  message: string;
  lang: string;
};

function parseBody(raw: unknown): { submission?: Submission; honeypot?: boolean; error?: string } {
  if (typeof raw !== "object" || raw === null) return { error: "invalid_body" };
  const body = raw as Record<string, unknown>;

  // Hidden field real users never fill in — a value means a bot.
  if (typeof body.website === "string" && body.website.trim() !== "") return { honeypot: true };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const lang = body.lang === "en" ? "en" : "no";

  if (!name || name.length > LIMITS.name) return { error: "invalid_name" };
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) return { error: "invalid_email" };
  if (topic.length > LIMITS.topic) return { error: "invalid_topic" };
  if (!message || message.length > LIMITS.message) return { error: "invalid_message" };

  return { submission: { name, email, topic, message, lang } };
}

async function storeInDatabase(s: Submission): Promise<boolean> {
  await db.insert(contactSubmissions).values({
    name: s.name,
    email: s.email,
    topic: s.topic || null,
    message: s.message,
    lang: s.lang,
  });
  return true;
}

async function sendNotificationMail(s: Submission): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  if (!host) return false;
  const nodemailer = (await import("nodemailer")).default;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
  const subject =
    (s.lang === "no" ? "Henvendelse" : "Inquiry") +
    (s.topic ? ` — ${s.topic}` : "") +
    ` (${s.name})`;
  const text = [
    `Navn / Name: ${s.name}`,
    `E-post / E-mail: ${s.email}`,
    `Tema / Topic: ${s.topic || "—"}`,
    `Språk / Language: ${s.lang.toUpperCase()}`,
    "",
    s.message,
  ].join("\n");
  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Moore UB <post@mooreub.no>",
    to: process.env.MAIL_INTERNAL_TO ?? "post@mooreub.no",
    replyTo: s.email,
    subject,
    text,
  });
  return true;
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { submission, honeypot, error } = parseBody(raw);
  if (honeypot) return NextResponse.json({ ok: true });
  if (!submission) return NextResponse.json({ error }, { status: 400 });

  let stored = false;
  let emailed = false;

  try {
    stored = await storeInDatabase(submission);
  } catch (err) {
    console.error("contact: database write failed", err);
  }

  try {
    emailed = await sendNotificationMail(submission);
  } catch (err) {
    console.error("contact: e-mail delivery failed", err);
  }

  if (!stored && !emailed) {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored, emailed });
}
