# Moore UB — Website & CMS

Produktions-Website von **Moore UB** (Ungdomsbedrift, Thora Storm VGS, Trondheim) für
**MOORE ID** — digital rückverfolgbare Festmacherleinen. Öffentliche Seite (NO/EN) plus
selbst gehostetes CMS-Backend unter **`/m`**.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript · Tailwind CSS (Backend) + eigenes CSS (Public)
- **Postgres** (Neon) via **Drizzle ORM** — Schema in `src/lib/db/schema.ts`
- **NextAuth v5** — Passwort-Login mit Pflicht-2FA für Manager/Admins
- **SMTP** (nodemailer) über `mail.mooreub.no` — Kontaktformular & System-Mails
- **Vercel** — Hosting; **Vercel Blob** für Blog-Cover-Uploads

## Struktur

| Bereich | Pfad |
|---|---|
| Öffentliche Seiten (Start, Produkt, Om oss, Kontakt, Aktuelt/Blog) | `src/app/(public)` |
| Moore-Design-Komponenten | `src/components/moore/`, CSS: `src/app/(public)/moore.css` |
| CMS-Backend (Dashboard, Blog, Anfragen, Benutzer, Mail-Templates, Audit) | `src/app/(manager)/m` |
| Kontakt-API (Neon + SMTP, Honeypot) | `src/app/api/contact` |
| Auth-Guard für Server-Actions | `src/lib/require-manager.ts` |

## Entwicklung

```bash
npm install
cp .env.example .env.local   # DATABASE_URL, AUTH_SECRET, SMTP_* eintragen
npx drizzle-kit push          # Schema in die DB
ADMIN_EMAIL=… ADMIN_NAME=… ADMIN_PASSWORD=… npx tsx --env-file=.env.local scripts/create-admin.ts
npm run dev                   # Backend: http://localhost:3000/m/login
```

## Deployment (Vercel)

Auto-Deploy via GitHub-Integration. Benötigte Environment-Variablen:
`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_BASE_URL`,
`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`,
`MAIL_FROM`, `MAIL_INTERNAL_TO` — plus verbundener **Blob-Store** (`BLOB_READ_WRITE_TOKEN`).

---

Basis: übernommenes CMS-Grundgerüst, umgebaut für Moore UB (Juli 2026).
